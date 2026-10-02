<?php
declare(strict_types=1);

require_once __DIR__ . '/../../src/bootstrap.php';

header('Cache-Control: private, no-store');
start_app_session();
$sessionKey = hash('sha256', session_id());
session_write_close();

function demo_order_payload(array $row, array $items): array
{
    $paymentLabels = [
        'card' => 'クレジット / デビットカード（デモ）',
        'paypay' => 'PayPay（デモ）',
        'rakutenpay' => '楽天ペイ（デモ）',
        'transport' => '交通系電子マネー（デモ）',
        'konbini' => 'コンビニ払い（デモ）',
    ];
    $createdAt = new DateTimeImmutable((string)$row['created_at'], new DateTimeZone('UTC'));
    $deadline = $row['payment_deadline'] ?? null;
    return [
        'number' => (string)$row['order_code'],
        'date' => $createdAt->setTimezone(new DateTimeZone('Asia/Tokyo'))->format('Y/m/d'),
        'status' => $row['payment_method'] === 'konbini' ? 'コンビニ支払い待ち（デモ）' : '決済完了（デモ）',
        'paymentMethod' => (string)$row['payment_method'],
        'paymentLabel' => $paymentLabels[$row['payment_method']] ?? 'デモ決済',
        'paymentStore' => (string)$row['payment_store'],
        'paymentCode' => (string)$row['payment_code'],
        'paymentDeadline' => $deadline ? (new DateTimeImmutable((string)$deadline))->format('Y/n/j') : '',
        'subtotal' => (int)$row['subtotal'],
        'shipping' => (int)$row['shipping_price'],
        'total' => (int)$row['total_price'],
        'items' => $items,
        'isDemo' => true,
    ];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = db();

if ($method === 'GET') {
    $stmt = $pdo->prepare('SELECT * FROM demo_orders WHERE session_key = ? ORDER BY created_at DESC, id DESC LIMIT 50');
    $stmt->execute([$sessionKey]);
    $rows = $stmt->fetchAll();
    if (!$rows) json_response(['orders' => []]);

    $ids = array_column($rows, 'id');
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $itemsStmt = $pdo->prepare("SELECT order_id, catalog_key, product_name_snapshot, unit_price, quantity FROM demo_order_items WHERE order_id IN ($placeholders) ORDER BY id");
    $itemsStmt->execute($ids);
    $itemsByOrder = [];
    foreach ($itemsStmt->fetchAll() as $item) {
        $itemsByOrder[(int)$item['order_id']][] = [
            'id' => (string)$item['catalog_key'],
            'name' => (string)$item['product_name_snapshot'],
            'unitPrice' => (int)$item['unit_price'],
            'quantity' => (int)$item['quantity'],
        ];
    }
    json_response(['orders' => array_map(
        static fn(array $row): array => demo_order_payload($row, $itemsByOrder[(int)$row['id']] ?? []),
        $rows
    )]);
}

if ($method !== 'POST') {
    header('Allow: GET, POST');
    json_response(['error' => 'このHTTPメソッドには対応していません。'], 405);
}

// A browser form from another site must never create a demo order with this session.
if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site' && ($_SERVER['HTTP_ORIGIN'] ?? '') === '') {
    json_response(['error' => 'この接続元からのリクエストは許可されていません。'], 403);
}

$input = json_body();
$lines = $input['items'] ?? null;
if (!is_array($lines) || !array_is_list($lines) || count($lines) < 1 || count($lines) > 20) {
    json_response(['error' => '商品は1〜20種類で指定してください。'], 422);
}

$quantities = [];
foreach ($lines as $line) {
    if (!is_array($line)) json_response(['error' => '商品形式を確認してください。'], 422);
    $key = $line['id'] ?? null;
    $quantity = filter_var($line['quantity'] ?? null, FILTER_VALIDATE_INT);
    if (!is_string($key) || !preg_match('/^[A-Za-z0-9._-]{1,100}$/', $key) || isset($quantities[$key]) || $quantity === false || $quantity < 1 || $quantity > 10) {
        json_response(['error' => '商品IDと数量（1〜10）を確認してください。'], 422);
    }
    $quantities[$key] = $quantity;
}

$methodCode = $input['paymentMethod'] ?? null;
if (!in_array($methodCode, ['card', 'paypay', 'rakutenpay', 'transport', 'konbini'], true)) {
    json_response(['error' => 'お支払い方法を選択してください。'], 422);
}
$stores = ['セブン‐イレブン', 'ファミリーマート', 'ローソン', 'ミニストップ'];
$paymentStore = $methodCode === 'konbini' ? ($input['paymentStore'] ?? '') : '';
if ($methodCode === 'konbini' && !in_array($paymentStore, $stores, true)) {
    json_response(['error' => 'コンビニを選択してください。'], 422);
}

$orderItems = [];
$now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
$nowTokyo = $now->setTimezone(new DateTimeZone('Asia/Tokyo'));

try {
    $pdo->beginTransaction();
    $limitStmt = $pdo->prepare('SELECT COUNT(*) FROM demo_orders WHERE session_key = ? AND created_at >= ?');
    $limitStmt->execute([$sessionKey, $now->modify('-1 hour')->format('Y-m-d H:i:s')]);
    if ((int)$limitStmt->fetchColumn() >= 10) {
        $pdo->rollBack();
        json_response(['error' => 'デモ注文は1時間に10回までです。しばらくしてからお試しください。'], 429);
    }

    $keys = array_keys($quantities);
    $placeholders = implode(',', array_fill(0, count($keys), '?'));
    $productStmt = $pdo->prepare("SELECT catalog_key, name, price, stock, is_demo_price FROM products WHERE catalog_key IN ($placeholders) AND is_active = TRUE AND price > 0 AND (is_demo_price = TRUE OR stock > 0) FOR UPDATE");
    $productStmt->execute($keys);
    $productsByKey = [];
    foreach ($productStmt->fetchAll() as $product) $productsByKey[$product['catalog_key']] = $product;

    $subtotal = 0;
    foreach ($quantities as $key => $quantity) {
        $product = $productsByKey[$key] ?? null;
        if (!$product || (!(bool)$product['is_demo_price'] && (int)$product['stock'] < $quantity)) {
            $pdo->rollBack();
            json_response(['error' => '販売中の商品と在庫を確認してください。'], 409);
        }
        $unitPrice = (int)$product['price'];
        $subtotal += $unitPrice * $quantity;
        if ($subtotal > 4294967295) {
            $pdo->rollBack();
            json_response(['error' => 'ご注文金額の上限を超えています。'], 422);
        }
        $orderItems[] = ['id' => $key, 'name' => (string)$product['name'], 'unitPrice' => $unitPrice, 'quantity' => $quantity];
    }
    $shipping = $subtotal >= 11000 ? 0 : 660;
    $total = $subtotal + $shipping;
    if ($total > 4294967295) {
        $pdo->rollBack();
        json_response(['error' => 'ご注文金額の上限を超えています。'], 422);
    }

    $orderCode = 'DEMO-' . $nowTokyo->format('Ymd') . '-' . strtoupper(bin2hex(random_bytes(6)));
    $paymentCode = $methodCode === 'konbini' ? (string)random_int(100000, 999999) : '';
    $paymentDeadline = $methodCode === 'konbini' ? $nowTokyo->modify('+3 days')->format('Y-m-d') : null;
    $insert = $pdo->prepare('INSERT INTO demo_orders (order_code, session_key, payment_method, payment_store, payment_code, payment_deadline, subtotal, shipping_price, total_price, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $insert->execute([$orderCode, $sessionKey, $methodCode, $paymentStore, $paymentCode, $paymentDeadline, $subtotal, $shipping, $total, $now->format('Y-m-d H:i:s')]);
    $orderId = (int)$pdo->lastInsertId();
    $lineInsert = $pdo->prepare('INSERT INTO demo_order_items (order_id, catalog_key, product_name_snapshot, unit_price, quantity) VALUES (?, ?, ?, ?, ?)');
    foreach ($orderItems as $item) {
        $lineInsert->execute([$orderId, $item['id'], $item['name'], $item['unitPrice'], $item['quantity']]);
    }
    $pdo->commit();
} catch (Throwable $error) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    error_log('Demo order creation failed: ' . $error->getMessage());
    json_response(['error' => 'デモ注文を保存できませんでした。時間をおいて再度お試しください。'], 500);
}

json_response(['order' => demo_order_payload([
    'order_code' => $orderCode,
    'created_at' => $now->format('Y-m-d H:i:s'),
    'payment_method' => $methodCode,
    'payment_store' => $paymentStore,
    'payment_code' => $paymentCode,
    'payment_deadline' => $paymentDeadline,
    'subtotal' => $subtotal,
    'shipping_price' => $shipping,
    'total_price' => $total,
], $orderItems)], 201);
