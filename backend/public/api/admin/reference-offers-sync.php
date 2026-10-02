<?php
require_once __DIR__ . '/../../../src/bootstrap.php';
require_once __DIR__ . '/../../../src/reference_offers.php';
require_admin();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    json_response(['error' => 'POSTで送信してください。'], 405);
}

$input = json_body();
$sourceKey = is_string($input['source'] ?? null) ? trim($input['source']) : '';
$page = filter_var($input['page'] ?? 1, FILTER_VALIDATE_INT);
if ($page === false || $page < 1 || $page > 1000) json_response(['error' => 'ページ番号が正しくありません。'], 422);
$source = reference_feed_source($sourceKey);
if ($source === null) json_response(['error' => '利用許諾済みの取得元が設定されていません。'], 422);

try {
    $feed = reference_fetch_feed($source, $page);
} catch (Throwable $error) {
    error_log('Supplier reference feed failed: ' . $error->getMessage());
    json_response(['error' => '取得元の商品情報を読み込めませんでした。'], 502);
}

$retrievedAt = gmdate('Y-m-d H:i:s');
$expiresAt = gmdate('Y-m-d H:i:s', time() + $source['maxAgeHours'] * 3600);
$prepared = [];
$rejected = 0;
foreach ($feed['items'] as $raw) {
    $offer = is_array($raw) ? reference_clean_offer($raw, $sourceKey, $source, $retrievedAt, $expiresAt) : null;
    if ($offer === null) {
        $rejected++;
        continue;
    }
    $prepared[$offer['offer_key']] = $offer;
}

$inserted = 0;
$updated = 0;
try {
    $pdo = db();
    $pdo->beginTransaction();
    $statement = $pdo->prepare('INSERT INTO reference_offers (offer_key, source_key, external_id, source_name, seller_name, permission_reference, name, maker, category, platform, price_yen, image_url, product_url, description, retrieved_at, expires_at) VALUES (:offer_key, :source_key, :external_id, :source_name, :seller_name, :permission_reference, :name, :maker, :category, :platform, :price_yen, :image_url, :product_url, :description, :retrieved_at, :expires_at) ON DUPLICATE KEY UPDATE source_name=VALUES(source_name), seller_name=VALUES(seller_name), permission_reference=VALUES(permission_reference), name=VALUES(name), maker=VALUES(maker), category=VALUES(category), platform=VALUES(platform), price_yen=VALUES(price_yen), image_url=VALUES(image_url), product_url=VALUES(product_url), description=VALUES(description), retrieved_at=VALUES(retrieved_at), expires_at=VALUES(expires_at)');
    foreach ($prepared as $offer) {
        $statement->execute($offer);
        if ($statement->rowCount() === 1) $inserted++;
        else $updated++;
    }
    $pdo->commit();
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    error_log('Supplier reference storage failed: ' . $error->getMessage());
    json_response(['error' => '参考商品を保存できませんでした。'], 503);
}

$hasMore = is_bool($feed['hasMore'] ?? null) ? $feed['hasMore'] : count($feed['items']) === 100;
json_response([
    'source' => $sourceKey,
    'page' => $page,
    'fetched' => count($feed['items']),
    'inserted' => $inserted,
    'updated' => $updated,
    'rejected' => $rejected,
    'hasMore' => $hasMore,
    'nextPage' => $hasMore ? $page + 1 : null,
]);
