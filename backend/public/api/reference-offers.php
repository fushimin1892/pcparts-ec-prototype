<?php
require_once __DIR__ . '/../../src/bootstrap.php';
require_once __DIR__ . '/../../src/reference_offers.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    header('Allow: GET');
    json_response(['error' => 'GETで取得してください。'], 405);
}

$page = filter_var($_GET['page'] ?? 1, FILTER_VALIDATE_INT);
$perPage = filter_var($_GET['per_page'] ?? 24, FILTER_VALIDATE_INT);
if ($page === false || $page < 1 || $page > 10000 || $perPage === false || $perPage < 1 || $perPage > 100) {
    json_response(['error' => 'ページ番号または表示件数が正しくありません。'], 422);
}
foreach (['keyword', 'category', 'source'] as $field) {
    if (isset($_GET[$field]) && !is_string($_GET[$field])) json_response(['error' => '検索条件が正しくありません。'], 422);
}
$keyword = mb_substr(trim((string)($_GET['keyword'] ?? '')), 0, 100);
$category = trim((string)($_GET['category'] ?? ''));
$source = trim((string)($_GET['source'] ?? ''));
$categories = ['CPU', 'GPU', 'マザーボード', 'SSD', 'メモリ', 'CPUクーラー', 'ファン', 'PCケース', 'PC電源'];
if ($category !== '' && $category !== 'すべて' && !in_array($category, $categories, true)) {
    json_response(['error' => 'カテゴリが正しくありません。'], 422);
}
if ($source !== '' && !preg_match('/^[a-z0-9][a-z0-9_-]{0,63}$/', $source)) {
    json_response(['error' => '取得元が正しくありません。'], 422);
}

$conditions = ['expires_at > UTC_TIMESTAMP()'];
$params = [];
if ($keyword !== '') {
    $conditions[] = '(name LIKE :name OR maker LIKE :maker OR seller_name LIKE :seller)';
    $params['name'] = '%' . $keyword . '%';
    $params['maker'] = $params['name'];
    $params['seller'] = $params['name'];
}
if ($category !== '' && $category !== 'すべて') {
    $conditions[] = 'category = :category';
    $params['category'] = $category;
}
if ($source !== '') {
    $conditions[] = 'source_key = :source';
    $params['source'] = $source;
}
$where = ' WHERE ' . implode(' AND ', $conditions);

$activeSources = reference_active_sources();
if (!$activeSources) {
    json_response(['items' => [], 'total' => 0, 'page' => $page, 'perPage' => $perPage, 'hasMore' => false]);
}
$activeConditions = [];
$index = 0;
foreach ($activeSources as $activeKey => $activeSource) {
    $keyParam = 'active_source_' . $index;
    $permissionParam = 'active_permission_' . $index;
    $activeConditions[] = '(source_key = :' . $keyParam . ' AND permission_reference = :' . $permissionParam .
        ' AND retrieved_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL ' . $activeSource['maxAgeHours'] . ' HOUR))';
    $params[$keyParam] = $activeKey;
    $params[$permissionParam] = $activeSource['permissionReference'];
    $index++;
}
$where .= ' AND (' . implode(' OR ', $activeConditions) . ')';

try {
    $pdo = db();
    $count = $pdo->prepare('SELECT COUNT(*) FROM reference_offers' . $where);
    $count->execute($params);
    $total = (int)$count->fetchColumn();

    $query = $pdo->prepare('SELECT offer_key, source_key, source_name, seller_name, name, maker, category, platform, price_yen, image_url, product_url, description, retrieved_at FROM reference_offers' . $where . ' ORDER BY retrieved_at DESC, id DESC LIMIT :limit OFFSET :offset');
    foreach ($params as $name => $value) $query->bindValue(':' . $name, $value, PDO::PARAM_STR);
    $query->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $query->bindValue(':offset', ($page - 1) * $perPage, PDO::PARAM_INT);
    $query->execute();
    $items = array_map(static fn(array $row): array => [
        'id' => (string)$row['offer_key'],
        'name' => (string)$row['name'],
        'maker' => (string)$row['maker'],
        'category' => (string)$row['category'],
        'platform' => (string)$row['platform'],
        'price' => (int)$row['price_yen'],
        'imageUrl' => (string)$row['image_url'],
        'productUrl' => (string)$row['product_url'],
        'sourceName' => (string)$row['source_name'],
        'sourceKey' => (string)$row['source_key'],
        'sellerName' => (string)$row['seller_name'],
        'retrievedAt' => (new DateTimeImmutable((string)$row['retrieved_at'], new DateTimeZone('UTC')))->format(DateTimeInterface::ATOM),
        'description' => (string)$row['description'],
        'referenceOnly' => true,
    ], $query->fetchAll());
} catch (Throwable $error) {
    error_log('Reference offer listing failed: ' . $error->getMessage());
    json_response(['error' => '参考商品を取得できませんでした。'], 503);
}

json_response(['items' => $items, 'total' => $total, 'page' => $page, 'perPage' => $perPage, 'hasMore' => $page * $perPage < $total]);
