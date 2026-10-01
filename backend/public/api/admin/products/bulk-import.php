<?php
require_once __DIR__ . '/../../../src/bootstrap.php';
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
    $prepared[] = ['catalog_key' => $key] + clean_product($input);
}

$pdo = db();
$statement = $pdo->prepare('INSERT INTO products (catalog_key, name, short_name, maker, category, platform, product_type, price, image_url, product_url, manufacturer_url, specs, is_demo_price, stock, description, is_active) VALUES (:catalog_key, :name, :short_name, :maker, :category, :platform, :product_type, :price, :image_url, :product_url, :manufacturer_url, :specs, :is_demo_price, :stock, :description, TRUE) ON DUPLICATE KEY UPDATE name=VALUES(name), short_name=VALUES(short_name), maker=VALUES(maker), category=VALUES(category), platform=VALUES(platform), product_type=VALUES(product_type), price=VALUES(price), image_url=VALUES(image_url), product_url=VALUES(product_url), manufacturer_url=VALUES(manufacturer_url), specs=VALUES(specs), is_demo_price=VALUES(is_demo_price), stock=IF(products.stock > 0, products.stock, VALUES(stock)), description=VALUES(description), is_active=TRUE');

try {
    $pdo->beginTransaction();
    foreach ($prepared as $item) $statement->execute($item);
    $pdo->commit();
} catch (Throwable $error) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    error_log('Catalog bulk import failed: ' . $error->getMessage());
    json_response(['error' => '一括登録に失敗しました。入力データとデータベースを確認してください。'], 500);
}

json_response(['imported' => count($prepared), 'updated' => count($prepared)]);
