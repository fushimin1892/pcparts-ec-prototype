<?php
require_once __DIR__ . '/../../src/bootstrap.php';
$pdo = db();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $conditions = ['is_active = TRUE'];
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
    $stmt = $pdo->prepare('SELECT * FROM products WHERE ' . implode(' AND ', $conditions) . ' ORDER BY category, name LIMIT 500');
    $stmt->execute($params);
    json_response(['items' => array_map('product_payload', $stmt->fetchAll())]);
}

require_admin();

if ($method === 'POST') {
    $input = json_body();
    $item = clean_product($input);
    $key = trim((string)($input['id'] ?? ''));
    if ($key === '') $key = 'catalog-' . bin2hex(random_bytes(8));
    if (!preg_match('/^[A-Za-z0-9._-]{1,100}$/', $key)) json_response(['error' => '商品IDの形式が正しくありません。'], 422);
    $stmt = $pdo->prepare('INSERT INTO products (catalog_key, name, short_name, maker, category, platform, product_type, price, manufacturer_url, specs, is_demo_price, stock, description, is_active) VALUES (:catalog_key, :name, :short_name, :maker, :category, :platform, :product_type, :price, :manufacturer_url, :specs, :is_demo_price, :stock, :description, TRUE)');
    $stmt->execute(['catalog_key' => $key] + $item);
    $select = $pdo->prepare('SELECT * FROM products WHERE catalog_key = ?');
    $select->execute([$key]);
    json_response(['item' => product_payload($select->fetch())], 201);
}

if ($method === 'PUT') {
    $key = trim((string)($_GET['id'] ?? ''));
    if ($key === '') json_response(['error' => '商品IDを指定してください。'], 400);
    $item = clean_product(json_body());
    $stmt = $pdo->prepare('UPDATE products SET name=:name, short_name=:short_name, maker=:maker, category=:category, platform=:platform, product_type=:product_type, price=:price, manufacturer_url=:manufacturer_url, specs=:specs, is_demo_price=:is_demo_price, stock=:stock, description=:description, is_active=TRUE WHERE catalog_key=:catalog_key');
    $stmt->execute($item + ['catalog_key' => $key]);
    if ($stmt->rowCount() === 0) {
        $exists = $pdo->prepare('SELECT 1 FROM products WHERE catalog_key = ?');
        $exists->execute([$key]);
        if (!$exists->fetchColumn()) json_response(['error' => '商品が見つかりません。'], 404);
    }
    $select = $pdo->prepare('SELECT * FROM products WHERE catalog_key = ?');
    $select->execute([$key]);
    json_response(['item' => product_payload($select->fetch())]);
}

if ($method === 'DELETE') {
    $key = trim((string)($_GET['id'] ?? ''));
    if ($key === '') json_response(['error' => '商品IDを指定してください。'], 400);
    $stmt = $pdo->prepare('UPDATE products SET is_active=FALSE WHERE catalog_key=? AND is_active=TRUE');
    $stmt->execute([$key]);
    if ($stmt->rowCount() === 0) json_response(['error' => '商品が見つかりません。'], 404);
    json_response(['deleted' => true, 'id' => $key]);
}

header('Allow: GET, POST, PUT, DELETE');
json_response(['error' => 'このHTTPメソッドには対応していません。'], 405);
