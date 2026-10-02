<?php
require_once __DIR__ . '/../../src/bootstrap.php';
$pdo = db();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $includeInactive = ($_GET['include_inactive'] ?? '') === '1';
    if ($includeInactive) require_admin();
    $conditions = $includeInactive ? [] : ['is_active = TRUE'];
    $params = [];
    $query = trim((string)($_GET['keyword'] ?? ''));
    $category = trim((string)($_GET['category'] ?? ''));
    $platform = trim((string)($_GET['platform'] ?? ''));
    if ($query !== '') {
        $conditions[] = '(name LIKE :name OR maker LIKE :maker OR category LIKE :categoryQuery)';
        $params['name'] = '%' . mb_substr($query, 0, 100) . '%';
        $params['maker'] = $params['name'];
        $params['categoryQuery'] = $params['name'];
    }
    if ($category !== '' && $category !== 'すべて') {
        $conditions[] = 'category = :category';
        $params['category'] = mb_substr($category, 0, 80);
    }
    if (in_array($platform, ['Intel', 'AMD'], true)) {
        $conditions[] = 'platform = :platform';
        $params['platform'] = $platform;
    }
    $where = $conditions ? ' WHERE ' . implode(' AND ', $conditions) : '';
    $stmt = $pdo->prepare('SELECT * FROM products' . $where . ' ORDER BY category, name LIMIT 2000');
    $stmt->execute($params);
    json_response(['items' => array_map('product_payload', $stmt->fetchAll())]);
}

require_admin();

if ($method === 'POST') {
    $input = json_body();
    if (array_key_exists('isActive', $input) && !is_bool($input['isActive'])) json_response(['error' => '公開状態はtrueまたはfalseで指定してください。'], 422);
    $item = clean_product($input);
    $item['is_active'] = !empty($input['isActive']) ? 1 : 0;
    if ($item['is_active']) require_publishable_product($item);
    $key = trim((string)($input['id'] ?? ''));
    if ($key === '') $key = 'catalog-' . bin2hex(random_bytes(8));
    if (!preg_match('/^[A-Za-z0-9._-]{1,100}$/', $key)) json_response(['error' => '商品IDの形式が正しくありません。'], 422);
    $stmt = $pdo->prepare('INSERT INTO products (catalog_key, name, short_name, maker, category, platform, product_type, price, image_url, product_url, manufacturer_url, specs, is_demo_price, stock, description, is_active) VALUES (:catalog_key, :name, :short_name, :maker, :category, :platform, :product_type, :price, :image_url, :product_url, :manufacturer_url, :specs, :is_demo_price, :stock, :description, :is_active)');
    $stmt->execute(['catalog_key' => $key] + $item);
    $select = $pdo->prepare('SELECT * FROM products WHERE catalog_key = ?');
    $select->execute([$key]);
    json_response(['item' => product_payload($select->fetch())], 201);
}

if ($method === 'PUT') {
    $key = trim((string)($_GET['id'] ?? ''));
    if ($key === '') json_response(['error' => '商品IDを指定してください。'], 400);
    $input = json_body();
    if (array_key_exists('isActive', $input) && !is_bool($input['isActive'])) json_response(['error' => '公開状態はtrueまたはfalseで指定してください。'], 422);
    $item = clean_product($input);
    $current = $pdo->prepare('SELECT is_active FROM products WHERE catalog_key = ?');
    $current->execute([$key]);
    $currentActive = $current->fetchColumn();
    if ($currentActive === false) json_response(['error' => '商品が見つかりません。'], 404);
    $item['is_active'] = array_key_exists('isActive', $input) ? (!empty($input['isActive']) ? 1 : 0) : (int)$currentActive;
    if ($item['is_active']) require_publishable_product($item);
    $stmt = $pdo->prepare('UPDATE products SET name=:name, short_name=:short_name, maker=:maker, category=:category, platform=:platform, product_type=:product_type, price=:price, image_url=:image_url, product_url=:product_url, manufacturer_url=:manufacturer_url, specs=:specs, is_demo_price=:is_demo_price, stock=:stock, description=:description, is_active=:is_active WHERE catalog_key=:catalog_key');
    $stmt->execute($item + ['catalog_key' => $key]);
    $select = $pdo->prepare('SELECT * FROM products WHERE catalog_key = ?');
    $select->execute([$key]);
    json_response(['item' => product_payload($select->fetch())]);
}

if ($method === 'DELETE') {
    $key = trim((string)($_GET['id'] ?? ''));
    if ($key === '') json_response(['error' => '商品IDを指定してください。'], 400);
    try {
        $pdo->beginTransaction();
        $lookup = $pdo->prepare('SELECT id, is_active FROM products WHERE catalog_key=? FOR UPDATE');
        $lookup->execute([$key]);
        $product = $lookup->fetch();
        if (!$product) {
            $pdo->rollBack();
            json_response(['error' => '商品が見つかりません。'], 404);
        }
        if ($product['is_active']) {
            $deactivate = $pdo->prepare('UPDATE products SET is_active=FALSE WHERE id=?');
            $deactivate->execute([$product['id']]);
            $pdo->commit();
            json_response(['deleted' => true, 'archived' => true, 'id' => $key]);
        }
        $orderLookup = $pdo->prepare('SELECT 1 FROM order_items WHERE product_id=? LIMIT 1');
        $orderLookup->execute([$product['id']]);
        if ($orderLookup->fetchColumn()) {
            $pdo->rollBack();
            json_response(['error' => '注文履歴に使われた商品は削除できません。非公開のまま保存してください。'], 409);
        }
        $delete = $pdo->prepare('DELETE FROM products WHERE id=?');
        $delete->execute([$product['id']]);
        $pdo->commit();
        json_response(['deleted' => true, 'archived' => false, 'id' => $key]);
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        error_log('Product delete failed: ' . $error->getMessage());
        json_response(['error' => '商品の削除に失敗しました。'], 500);
    }
}

header('Allow: GET, POST, PUT, DELETE');
json_response(['error' => 'このHTTPメソッドには対応していません。'], 405);
