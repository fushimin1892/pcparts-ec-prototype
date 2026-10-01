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
if (!$apiKey || !$model) json_response(['error' => 'GEMINI_API_KEYとGEMINI_MODELをPHPサーバーに設定してください。'], 503);

$pdo = db();
$catalogRows = $pdo->query('SELECT * FROM products WHERE is_active=TRUE AND stock > 0 ORDER BY category, name LIMIT 500')->fetchAll();
$catalog = array_map('product_payload', $catalogRows);

// Rakuten data is returned only as external comparison context. It never becomes a catalog item or a cart ID.
$references = [];
$rakutenAppId = env_value('RAKUTEN_APP_ID');
$requestText = implode(' ', [$answers['useCase'], $answers['gamesAndTasks'], $answers['designAndPerformance'], $answers['otherConditions']]);
$searchTerm = preg_match('/(GPU|グラボ|グラフィック|fps|ゲーム|ARK|VALORANT)/iu', $requestText) ? 'GeForce RTX 5070' :
    (preg_match('/(CPU|プロセッサ|配信|動画|Blender|CAD|開発|編集)/iu', $requestText) ? 'Ryzen 7 7700' :
    (preg_match('/(メモリ|RAM)/iu', $requestText) ? 'DDR5 32GB' : 'PCパーツ'));
$rakutenKeyword = mb_substr($searchTerm, 0, 100);
if ($rakutenAppId && function_exists('curl_init')) {
    $rakutenParams = [
        'applicationId' => $rakutenAppId,
        'keyword' => $rakutenKeyword,
        'formatVersion' => 2,
        'hits' => 5,
        'sort' => '+itemPrice',
    ];
    if ($accessKey = env_value('RAKUTEN_ACCESS_KEY')) $rakutenParams['accessKey'] = $accessKey;
    $url = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?' . http_build_query($rakutenParams);
    $curl = curl_init($url);
    curl_setopt_array($curl, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8, CURLOPT_CONNECTTIMEOUT => 4, CURLOPT_USERAGENT => 'PCPartsShop/1.0']);
    $rakutenBody = curl_exec($curl);
    $rakutenStatus = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    if (is_string($rakutenBody) && $rakutenStatus >= 200 && $rakutenStatus < 300) {
        $rakuten = json_decode($rakutenBody, true);
        foreach (($rakuten['Items'] ?? []) as $entry) {
            $item = $entry['Item'] ?? $entry;
            if (!isset($item['itemName'], $item['itemPrice'], $item['itemUrl'])) continue;
            $references[] = [
                'itemName' => mb_substr((string)$item['itemName'], 0, 200),
                'price' => (int)$item['itemPrice'],
                'imageUrl' => (string)($item['mediumImageUrls'][0]['imageUrl'] ?? ''),
                'productUrl' => (string)$item['itemUrl'],
                'shopName' => mb_substr((string)($item['shopName'] ?? ''), 0, 100),
                'referenceOnly' => true,
            ];
        }
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
foreach (($proposal['recommendations'] ?? []) as $candidate) {
    $key = (string)($candidate['id'] ?? '');
    if (!isset($byKey[$key])) continue;
    $recommended[] = $byKey[$key] + ['reason' => mb_substr((string)($candidate['reason'] ?? ''), 0, 300)];
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
        $compatible = $item['platform'] === $selectedCpu['platform'] && ($cpuSocket === '' || $cpuSocket === $boardSocket);
        if ($compatible) continue;
        $replacement = null;
        foreach ($catalog as $candidateBoard) {
            if ($candidateBoard['category'] !== 'マザーボード' || $candidateBoard['platform'] !== $selectedCpu['platform']) continue;
            $candidateSocket = (string)($candidateBoard['specs']['ソケット'] ?? '');
            if ($cpuSocket !== '' && $candidateSocket !== $cpuSocket) continue;
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
$summary = mb_substr((string)($proposal['summary'] ?? ''), 0, 1000);
if ($compatibilityNote !== '') $summary = trim($summary . ' ' . $compatibilityNote);
json_response([
    'summary' => mb_substr($summary, 0, 1000),
    'imagePrompt' => mb_substr((string)($proposal['imagePrompt'] ?? ''), 0, 1000),
    'items' => $recommended,
    'totalPrice' => $total,
    'references' => $references,
    'referenceNotes' => mb_substr((string)($proposal['referenceNotes'] ?? ''), 0, 1000),
]);
