<?php
require_once __DIR__ . '/../../../../src/bootstrap.php';
require_admin();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    json_response(['error' => 'このHTTPメソッドには対応していません。'], 405);
}

$items = json_body()['items'] ?? null;
if (!is_array($items) || count($items) < 1 || count($items) > 1000) {
    json_response(['error' => '商品データは1〜1,000件で送ってください。'], 422);
}

$prepared = [];
$keys = [];
foreach ($items as $index => $input) {
    if (!is_array($input)) json_response(['error' => ($index + 1) . '件目の商品形式を確認してください。'], 422);
    $key = trim((string)($input['id'] ?? ''));
    if (!preg_match('/^[A-Za-z0-9._-]{1,100}$/', $key)) json_response(['error' => ($index + 1) . '件目の商品IDの形式を確認してください。'], 422);
    if (isset($keys[$key])) json_response(['error' => '商品IDが重複しています: ' . $key], 422);
    $keys[$key] = true;
    $item = clean_product($input);
    if ($item['price'] < 1 || !$item['image_url'] || !$item['product_url']) {
        json_response(['error' => ($index + 1) . '件目は取得価格・商品画像URL・取得元商品URLが必要です。'], 422);
    }
    // Marketplace results are reference data, not offers backed by our own inventory.
    $item['is_demo_price'] = 1;
    $item['stock'] = 0;
    $prepared[] = ['catalog_key' => $key] + $item;
}

$pdo = db();
$lookup = $pdo->prepare('SELECT is_active, stock, is_demo_price FROM products WHERE catalog_key = ? FOR UPDATE');
$insert = $pdo->prepare('INSERT INTO products (catalog_key, name, short_name, maker, category, platform, product_type, price, image_url, product_url, manufacturer_url, specs, is_demo_price, stock, description, is_active) VALUES (:catalog_key, :name, :short_name, :maker, :category, :platform, :product_type, :price, :image_url, :product_url, :manufacturer_url, :specs, :is_demo_price, :stock, :description, FALSE)');
$update = $pdo->prepare('UPDATE products SET name=:name, short_name=:short_name, maker=:maker, category=:category, platform=:platform, product_type=:product_type, price=:price, image_url=:image_url, product_url=:product_url, manufacturer_url=:manufacturer_url, specs=:specs, is_demo_price=:is_demo_price, stock=:stock, description=:description, is_active=FALSE WHERE catalog_key=:catalog_key');
$inserted = 0;
$updated = 0;
$skipped = 0;

try {
    $pdo->beginTransaction();
    foreach ($prepared as $item) {
        $lookup->execute([$item['catalog_key']]);
        $existing = $lookup->fetch();
        if ($existing && ($existing['is_active'] || $existing['stock'] > 0 || !$existing['is_demo_price'])) {
            $skipped++;
            continue;
        }
        if ($existing) {
            $update->execute($item);
            $updated++;
        } else {
            $insert->execute($item);
            $inserted++;
        }
    }
    $pdo->commit();
} catch (Throwable $error) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    error_log('Catalog bulk import failed: ' . $error->getMessage());
    json_response(['error' => '一括登録に失敗しました。入力データとデータベースを確認してください。'], 500);
}

json_response(['imported' => $inserted + $updated, 'inserted' => $inserted, 'updated' => $updated, 'skipped' => $skipped]);
