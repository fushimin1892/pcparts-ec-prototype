<?php
require_once __DIR__ . '/../../../src/bootstrap.php';
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') json_response(['error' => 'POSTで送信してください。'], 405);
$input = json_body();
$fields = ['budgetText', 'useCase', 'gamesAndTasks', 'designAndPerformance', 'ownedEquipment', 'otherConditions'];
$answers = [];
foreach ($fields as $field) {
    $answers[$field] = mb_substr(trim((string)($input[$field] ?? '')), 0, 400);
}
if ($answers['budgetText'] === '' || $answers['useCase'] === '' || $answers['gamesAndTasks'] === '') {
    json_response(['error' => '予算・用途・ゲームや作業内容を入力してください。'], 422);
}
$apiKey = env_value('GEMINI_API_KEY');
$model = env_value('GEMINI_MODEL');
if (!$apiKey || !$model) json_response(['error' => 'AI相談機能はまだ設定されていません。'], 503);
if (!function_exists('curl_init')) json_response(['error' => 'AI相談サービスへの接続機能が利用できません。'], 503);

function limit_ai_request(PDO $pdo, string $apiKey): void
{
    // REMOTE_ADDR is supplied by the web server; forwarded headers are client-controlled.
    $remoteIp = $_SERVER['REMOTE_ADDR'] ?? '';
    if (!is_string($remoteIp) || !filter_var($remoteIp, FILTER_VALIDATE_IP)) {
        json_response(['error' => 'AI相談の利用制限を確認できません。'], 503);
    }
    $clientHash = hash_hmac('sha256', $remoteIp, $apiKey);
    $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    $nowSql = $now->format('Y-m-d H:i:s');
    $cutoff = $now->modify('-1 hour');
    try {
        $pdo->beginTransaction();
        $insert = $pdo->prepare('INSERT IGNORE INTO ai_rate_limits (client_hash, window_started_at, request_count, updated_at) VALUES (?, ?, 0, ?)');
        $insert->execute([$clientHash, $nowSql, $nowSql]);
        $lookup = $pdo->prepare('SELECT window_started_at, request_count FROM ai_rate_limits WHERE client_hash = ? FOR UPDATE');
        $lookup->execute([$clientHash]);
        $row = $lookup->fetch();
        if (!$row) throw new RuntimeException('AI rate limit row was not available.');
        $windowStart = new DateTimeImmutable((string)$row['window_started_at'], new DateTimeZone('UTC'));
        if ($windowStart <= $cutoff) {
            $update = $pdo->prepare('UPDATE ai_rate_limits SET window_started_at = ?, request_count = 1, updated_at = ? WHERE client_hash = ?');
            $update->execute([$nowSql, $nowSql, $clientHash]);
        } else {
            if ((int)$row['request_count'] >= 12) {
                $pdo->rollBack();
                json_response(['error' => 'AI相談は1時間に12回までです。しばらくしてからお試しください。'], 429);
            }
            $update = $pdo->prepare('UPDATE ai_rate_limits SET request_count = request_count + 1, updated_at = ? WHERE client_hash = ?');
            $update->execute([$nowSql, $clientHash]);
        }
        if (random_int(1, 100) === 1) {
            $cleanup = $pdo->prepare('DELETE FROM ai_rate_limits WHERE updated_at < ? LIMIT 1000');
            $cleanup->execute([$now->modify('-7 days')->format('Y-m-d H:i:s')]);
        }
        $pdo->commit();
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        error_log('AI rate limit check failed.');
        json_response(['error' => 'AI相談の利用制限を確認できません。'], 503);
    }
}

function ai_budget_yen(string $text): ?int
{
    $normalized = str_replace([',', '，'], '', mb_convert_kana($text, 'n', 'UTF-8'));
    if (preg_match('/(\d+(?:\.\d+)?)\s*万/u', $normalized, $match)) return (int)round((float)$match[1] * 10000);
    if (preg_match('/\b(\d{4,9})\s*円?\b/u', $normalized, $match)) return (int)$match[1];
    return null;
}

function ai_catalog_candidates(array $products, array $answers): array
{
    $quotas = [
        'CPU' => 24, 'GPU' => 24, 'マザーボード' => 24, 'SSD' => 18,
        'メモリ' => 18, 'CPUクーラー' => 12, 'ファン' => 12,
        'PCケース' => 18, 'PC電源' => 16, 'その他' => 12,
    ];
    $budgetWeights = [
        'CPU' => 0.20, 'GPU' => 0.32, 'マザーボード' => 0.12, 'SSD' => 0.08,
        'メモリ' => 0.08, 'CPUクーラー' => 0.06, 'ファン' => 0.03,
        'PCケース' => 0.12, 'PC電源' => 0.10, 'その他' => 0.12,
    ];
    $request = implode(' ', $answers);
    $budget = ai_budget_yen($answers['budgetText']);
    $terms = [];
    foreach (preg_split('/[\s、。，・\/]+/u', mb_strtolower($request), -1, PREG_SPLIT_NO_EMPTY) ?: [] as $term) {
        if (mb_strlen($term) >= 2 && mb_strlen($term) <= 30) $terms[$term] = true;
    }
    if (preg_match('/白|ホワイト|white/iu', $request)) foreach (['白', 'ホワイト', 'white'] as $term) $terms[$term] = true;
    if (preg_match('/黒|ブラック|black/iu', $request)) foreach (['黒', 'ブラック', 'black'] as $term) $terms[$term] = true;
    if (preg_match('/光|キラキラ|rgb|argb|led/iu', $request)) foreach (['rgb', 'argb', 'led'] as $term) $terms[$term] = true;

    $groups = [];
    foreach ($products as $product) $groups[$product['category']][] = $product;
    $selected = [];
    foreach ($groups as $category => $items) {
        $quota = $quotas[$category] ?? 12;
        usort($items, static fn(array $a, array $b): int => $a['price'] <=> $b['price'] ?: strcmp($a['id'], $b['id']));
        if (count($items) <= $quota) {
            array_push($selected, ...$items);
            continue;
        }
        $chosen = [];
        $add = static function (array $item) use (&$chosen, $quota): void {
            if (count($chosen) < $quota) $chosen[$item['id']] = $item;
        };

        // Reserve half of each category for a spread of prices and generations.
        $spreadCount = (int)ceil($quota / 2);
        for ($i = 0; $i < $spreadCount; $i++) {
            $index = (int)round($i * (count($items) - 1) / max(1, $spreadCount - 1));
            $add($items[$index]);
        }

        $relevant = [];
        foreach ($items as $item) {
            $haystack = mb_strtolower($item['name'] . ' ' . $item['maker'] . ' ' . json_encode($item['specs'], JSON_UNESCAPED_UNICODE));
            $score = 0;
            foreach ($terms as $term => $_) if (mb_strpos($haystack, $term) !== false) $score++;
            if ($score > 0) $relevant[] = ['item' => $item, 'score' => $score];
        }
        usort($relevant, static fn(array $a, array $b): int => $b['score'] <=> $a['score'] ?: $a['item']['price'] <=> $b['item']['price']);
        $relevantLimit = (int)ceil($quota / 4);
        for ($i = 0; $i < min($relevantLimit, count($relevant)); $i++) $add($relevant[$i]['item']);

        if ($budget !== null) {
            $targetPrice = max(1, $budget * ($budgetWeights[$category] ?? 0.1));
            $nearBudget = $items;
            usort($nearBudget, static fn(array $a, array $b): int => abs(log(max(1, $a['price']) / $targetPrice)) <=> abs(log(max(1, $b['price']) / $targetPrice)));
            foreach ($nearBudget as $item) {
                $add($item);
                if (count($chosen) >= $quota) break;
            }
        }
        // Fill gaps when relevance and budget do not use the entire quota.
        for ($i = 0; $i < $quota * 3 && count($chosen) < $quota; $i++) {
            $index = (int)round($i * (count($items) - 1) / max(1, $quota * 3 - 1));
            $add($items[$index]);
        }
        array_push($selected, ...array_values($chosen));
    }
    return $selected;
}

$pdo = db();
$catalogRows = $pdo->query('SELECT * FROM products WHERE is_active=TRUE AND is_demo_price=FALSE AND stock > 0 ORDER BY category, price, catalog_key LIMIT 5000')->fetchAll();
$fullCatalog = array_map('product_payload', $catalogRows);
if (!$fullCatalog) json_response(['error' => '購入可能な商品がまだありません。管理画面で販売価格と在庫を確認してください。'], 409);
$catalog = ai_catalog_candidates($fullCatalog, $answers);
limit_ai_request($pdo, $apiKey);

// Rakuten data is returned only as external comparison context. It never becomes a catalog item or a cart ID.
$references = [];
$rakutenAppId = env_value('RAKUTEN_APP_ID');
$rakutenAccessKey = env_value('RAKUTEN_ACCESS_KEY');
$referenceStatus = 'not_configured';
$referenceNotice = '';
$requestText = implode(' ', [$answers['useCase'], $answers['gamesAndTasks'], $answers['designAndPerformance'], $answers['otherConditions']]);
$searchTerm = preg_match('/(GPU|グラボ|グラフィック|fps|ゲーム|ARK|VALORANT)/iu', $requestText) ? 'GeForce RTX 5070' :
    (preg_match('/(CPU|プロセッサ|配信|動画|Blender|CAD|開発|編集)/iu', $requestText) ? 'Ryzen 7 7700' :
    (preg_match('/(メモリ|RAM)/iu', $requestText) ? 'DDR5 32GB' : 'PCパーツ'));
$rakutenKeyword = mb_substr($searchTerm, 0, 100);
if (!$rakutenAppId || !$rakutenAccessKey) {
    $referenceNotice = '楽天市場の参考商品はAPI設定が未完了のため表示していません。';
} else {
    $rakutenParams = [
        'applicationId' => $rakutenAppId,
        'keyword' => $rakutenKeyword,
        'formatVersion' => 2,
        'hits' => 5,
        'sort' => '+itemPrice',
        'imageFlag' => 1,
        'availability' => 1,
    ];
    $url = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701?' . http_build_query($rakutenParams, '', '&', PHP_QUERY_RFC3986);
    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_USERAGENT => 'PCPartsShop/1.0',
        CURLOPT_HTTPHEADER => ['Accept: application/json', 'accessKey: ' . $rakutenAccessKey],
    ]);
    $rakutenBody = curl_exec($curl);
    $rakutenStatus = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    if (is_string($rakutenBody) && $rakutenStatus >= 200 && $rakutenStatus < 300) {
        $rakuten = json_decode($rakutenBody, true);
        if (is_array($rakuten) && is_array($rakuten['items'] ?? null)) {
            $retrievedAt = gmdate('c');
            foreach ($rakuten['items'] as $item) {
                if (!is_array($item) || !isset($item['itemName'], $item['itemPrice'], $item['itemUrl']) || trim((string)$item['itemName']) === '') continue;
                $productUrl = (string)$item['itemUrl'];
                $host = strtolower((string)parse_url($productUrl, PHP_URL_HOST));
                $price = filter_var($item['itemPrice'], FILTER_VALIDATE_INT);
                if (!filter_var($productUrl, FILTER_VALIDATE_URL) || !preg_match('/(^|\\.)rakuten\\.co\\.jp$/', $host) || !str_starts_with($productUrl, 'https://') || $price === false || $price < 1) continue;
                $image = $item['mediumImageUrls'][0] ?? '';
                $imageUrl = is_string($image) ? $image : (is_array($image) ? (string)($image['imageUrl'] ?? '') : '');
                if (!str_starts_with($imageUrl, 'https://')) $imageUrl = '';
                $references[] = [
                    'itemName' => mb_substr((string)$item['itemName'], 0, 200),
                    'price' => $price,
                    'imageUrl' => $imageUrl,
                    'productUrl' => $productUrl,
                    'shopName' => mb_substr((string)($item['shopName'] ?? ''), 0, 100),
                    'referenceOnly' => true,
                    'retrievedAt' => $retrievedAt,
                ];
            }
            $referenceStatus = $references ? 'ok' : 'no_results';
            if (!$references) $referenceNotice = '楽天市場で表示できる参考商品が見つかりませんでした。';
        } else {
            $referenceStatus = 'unavailable';
            $referenceNotice = '楽天市場の参考商品を取得できませんでした。自社商品の構成提案は続けられます。';
            error_log('Rakuten consultation reference response was invalid.');
        }
    } else {
        $referenceStatus = 'unavailable';
        $referenceNotice = '楽天市場の参考商品を取得できませんでした。自社商品の構成提案は続けられます。';
        error_log('Rakuten consultation reference request failed with HTTP ' . $rakutenStatus);
    }
}

$prompt = [
    'role' => 'PCパーツ選びの相談に答えるアシスタント',
    'rules' => [
        'ユーザーの希望を日本語で要約し、構成を提案する。',
        'purchaseItemsにはinternalCatalogに含まれるidだけを書く。架空IDや楽天の商品URLを購入商品として返さない。',
        'CPUとマザーボードを一緒に提案する場合はplatform（Intel/AMD）と仕様のソケットが両方一致するものだけを選ぶ。',
        'RakutenReferencesは外部相場の参考情報に限り、購入用カタログとは別物として扱う。',
        '予算は税込合計の目安。無理に全額使わず、予算外ならその理由を書く。',
        '出力はJSON objectのみ。summary, imagePrompt, recommendations[{id,reason}], referenceNotesを含める。',
    ],
    'userAnswers' => $answers,
    'internalCatalog' => array_map(static fn(array $item): array => [
        'id' => $item['id'], 'name' => $item['name'], 'maker' => $item['maker'], 'category' => $item['category'], 'platform' => $item['platform'],
        'price' => $item['price'], 'stock' => $item['stock'], 'specs' => $item['specs'], 'demoPrice' => $item['isDemoPrice'],
    ], $catalog),
    'rakutenReferences' => $references,
];
$requestJson = json_encode(['contents' => [['parts' => [['text' => json_encode($prompt, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]]]], 'generationConfig' => ['temperature' => 0.2, 'responseMimeType' => 'application/json']], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($model) . ':generateContent';
$curl = curl_init($endpoint);
curl_setopt_array($curl, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 25, CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_POST => true, CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'x-goog-api-key: ' . $apiKey], CURLOPT_POSTFIELDS => $requestJson]);
$geminiBody = curl_exec($curl);
$geminiStatus = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);
if (!is_string($geminiBody) || $geminiStatus < 200 || $geminiStatus >= 300) {
    error_log('Gemini consultation request failed with HTTP ' . $geminiStatus);
    json_response(['error' => 'AI相談サービスから回答を取得できませんでした。'], 502);
}
$gemini = json_decode($geminiBody, true);
$text = $gemini['candidates'][0]['content']['parts'][0]['text'] ?? '';
$proposal = json_decode((string)$text, true);
if (!is_array($proposal)) {
    error_log('Gemini returned an invalid JSON proposal.');
    json_response(['error' => 'AIの回答形式を確認できませんでした。もう一度お試しください。'], 502);
}
$byKey = [];
foreach ($catalog as $product) $byKey[$product['id']] = $product;
$recommended = [];
$selectedCategories = [];
$candidates = is_array($proposal['recommendations'] ?? null) ? $proposal['recommendations'] : [];
foreach ($candidates as $candidate) {
    if (!is_array($candidate)) continue;
    $key = is_scalar($candidate['id'] ?? null) ? (string)$candidate['id'] : '';
    if (!isset($byKey[$key])) continue;
    $category = $byKey[$key]['category'];
    if (isset($selectedCategories[$category])) continue;
    $selectedCategories[$category] = true;
    $reason = is_scalar($candidate['reason'] ?? null) ? (string)$candidate['reason'] : '';
    $recommended[] = $byKey[$key] + ['reason' => mb_substr($reason, 0, 300)];
    if (count($recommended) >= 10) break;
}
$selectedCpu = null;
foreach ($recommended as $item) {
    if ($item['category'] === 'CPU') { $selectedCpu = $item; break; }
}
$compatibilityNote = '';
if ($selectedCpu !== null) {
    $cpuSocket = (string)($selectedCpu['specs']['ソケット'] ?? '');
    foreach ($recommended as $index => $item) {
        if ($item['category'] !== 'マザーボード') continue;
        $boardSocket = (string)($item['specs']['ソケット'] ?? '');
        $compatible = $item['platform'] === $selectedCpu['platform'] && $cpuSocket !== '' && $cpuSocket === $boardSocket;
        if ($compatible) continue;
        $replacement = null;
        foreach ($fullCatalog as $candidateBoard) {
            if ($candidateBoard['category'] !== 'マザーボード' || $candidateBoard['platform'] !== $selectedCpu['platform']) continue;
            $candidateSocket = (string)($candidateBoard['specs']['ソケット'] ?? '');
            if ($cpuSocket === '' || $candidateSocket !== $cpuSocket) continue;
            $replacement = $candidateBoard;
            break;
        }
        if ($replacement !== null) {
            $recommended[$index] = $replacement + ['reason' => 'CPUとプラットフォーム・ソケットが一致するため選択'];
        } else {
            unset($recommended[$index]);
            $compatibilityNote = '登録カタログに互換マザーボードが見つからなかったため、マザーボードは構成案から外しました。';
        }
    }
    $recommended = array_values($recommended);
}
$total = array_sum(array_map(static fn(array $item): int => (int)$item['price'], $recommended));
$summary = mb_substr(is_scalar($proposal['summary'] ?? null) ? (string)$proposal['summary'] : '', 0, 1000);
if ($compatibilityNote !== '') $summary = trim($summary . ' ' . $compatibilityNote);
if ($referenceStatus === 'not_configured' || $referenceStatus === 'unavailable') {
    $summary = trim(mb_substr($summary, 0, max(0, 999 - mb_strlen($referenceNotice))) . ' ' . $referenceNotice);
}
$referenceNotes = is_scalar($proposal['referenceNotes'] ?? null) ? (string)$proposal['referenceNotes'] : '';
if ($referenceNotice !== '') $referenceNotes = trim($referenceNotes . ' ' . $referenceNotice);
json_response([
    'summary' => mb_substr($summary, 0, 1000),
    'imagePrompt' => mb_substr(is_scalar($proposal['imagePrompt'] ?? null) ? (string)$proposal['imagePrompt'] : '', 0, 1000),
    'items' => $recommended,
    'totalPrice' => $total,
    'references' => $references,
    'referenceStatus' => $referenceStatus,
    'referenceNotice' => $referenceNotice,
    'referenceNotes' => mb_substr($referenceNotes, 0, 1000),
]);
