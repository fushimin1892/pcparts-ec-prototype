<?php
declare(strict_types=1);

require_once __DIR__ . '/env.php';

function cors_headers(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = array_values(array_filter(array_map('trim', explode(',', env_value('APP_ALLOWED_ORIGINS', 'http://localhost:8080,http://127.0.0.1:8080') ?? ''))));
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (int)($_SERVER['SERVER_PORT'] ?? 0) === 443 || filter_var(env_value('SESSION_SECURE', 'false'), FILTER_VALIDATE_BOOLEAN);
    $sameOrigin = ($_SERVER['HTTP_HOST'] ?? '') !== '' && $origin === ($isHttps ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'];
    if ($origin !== '' && !$sameOrigin && !in_array('*', $allowed, true) && !in_array($origin, $allowed, true)) {
        json_response(['error' => 'この接続元からのリクエストは許可されていません。'], 403);
    }
    if ($origin !== '') {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin');
    }
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Content-Type: application/json; charset=utf-8');
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function json_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function json_body(): array
{
    $body = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($body)) {
        json_response(['error' => 'JSON形式のリクエストを送ってください。'], 400);
    }
    return $body;
}

function db(): PDO
{
    static $connection = null;
    if ($connection instanceof PDO) return $connection;
    $host = env_value('DB_HOST', '127.0.0.1');
    $port = env_value('DB_PORT', '3306');
    $name = env_value('DB_NAME', 'pc_parts_shop');
    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";
    try {
        $connection = new PDO($dsn, env_value('DB_USER', 'pcparts'), env_value('DB_PASSWORD', ''), [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (Throwable $error) {
        error_log('Database connection failed: ' . $error->getMessage());
        json_response(['error' => 'データベースに接続できません。設定を確認してください。'], 503);
    }
    return $connection;
}

function start_app_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (int)($_SERVER['SERVER_PORT'] ?? 0) === 443 || filter_var(env_value('SESSION_SECURE', 'false'), FILTER_VALIDATE_BOOLEAN);
    session_name('pcparts_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $https,
        'httponly' => true,
        'samesite' => env_value('SESSION_SAMESITE', 'Lax'),
    ]);
    session_start();
}

function admin_authenticated(): bool
{
    header('Cache-Control: private, no-store');
    start_app_session();
    if (($_SESSION['role'] ?? null) !== 'admin' || !is_numeric($_SESSION['user_id'] ?? null)) return false;
    $stmt = db()->prepare("SELECT 1 FROM users WHERE id = ? AND role = 'admin' LIMIT 1");
    $stmt->execute([(int)$_SESSION['user_id']]);
    if ($stmt->fetchColumn()) return true;
    unset($_SESSION['role'], $_SESSION['user_id'], $_SESSION['admin_email']);
    return false;
}

function require_admin(): void
{
    if (!admin_authenticated()) {
        json_response(['error' => '管理者としてログインしてください。'], 401);
    }
}

function product_payload(array $row): array
{
    $specs = $row['specs'] ?? null;
    if (is_string($specs)) $specs = json_decode($specs, true);
    return [
        'id' => (string)$row['catalog_key'],
        'name' => (string)$row['name'],
        'shortName' => (string)($row['short_name'] ?: $row['name']),
        'maker' => (string)$row['maker'],
        'platform' => (string)($row['platform'] ?? ''),
        'category' => (string)$row['category'],
        'type' => (string)$row['product_type'],
        'price' => (int)$row['price'],
        'stock' => (int)$row['stock'],
        'rating' => 0,
        'reviews' => 0,
        'description' => (string)($row['description'] ?? ''),
        'specs' => is_array($specs) ? $specs : new stdClass(),
        'manufacturerUrl' => $row['manufacturer_url'] ?? '',
        'imageUrl' => $row['image_url'] ?? '',
        'productUrl' => $row['product_url'] ?? '',
        'sourceName' => is_array($specs) ? (string)($specs['取得元'] ?? '') : '',
        'isDemoPrice' => (bool)$row['is_demo_price'],
        'isActive' => (bool)$row['is_active'],
    ];
}

function require_publishable_product(array $item): void
{
    if ($item['price'] < 1 || $item['stock'] < 1 || $item['is_demo_price'] || !$item['image_url']) {
        json_response(['error' => '公開するには自社の販売価格・在庫・商品画像を確認し、仮価格を解除してください。'], 422);
    }
}

function clean_product(array $input): array
{
    $name = trim((string)($input['name'] ?? ''));
    $category = trim((string)($input['category'] ?? ''));
    $categories = [
        'CPU' => 'cpu', 'GPU' => 'gpu', 'マザーボード' => 'board', 'SSD' => 'ssd',
        'メモリ' => 'ram', 'CPUクーラー' => 'cooler', 'ファン' => 'fan',
        'PCケース' => 'case', 'PC電源' => 'psu', 'その他' => 'other',
    ];
    $platform = trim((string)($input['platform'] ?? ''));
    $price = filter_var($input['price'] ?? null, FILTER_VALIDATE_INT);
    $stock = filter_var($input['stock'] ?? null, FILTER_VALIDATE_INT);
    if ($name === '' || mb_strlen($name) > 255 || !isset($categories[$category]) || $price === false || $price < 0 || $price > 4294967295 || $stock === false || $stock < 0 || $stock > 4294967295) {
        json_response(['error' => '商品名・カテゴリ・価格・在庫の内容を確認してください。'], 422);
    }
    if (in_array($category, ['CPU', 'マザーボード'], true) && !in_array($platform, ['Intel', 'AMD'], true)) {
        json_response(['error' => 'CPUとマザーボードにはIntelまたはAMDのプラットフォームを指定してください。'], 422);
    }
    if (!in_array($category, ['CPU', 'マザーボード'], true)) $platform = '';
    $productType = $categories[$category];
    if ($category === 'その他' && preg_match('/^[a-z0-9_-]{1,24}$/', (string)($input['type'] ?? ''))) {
        $productType = (string)$input['type'];
    }
    $specs = $input['specs'] ?? new stdClass();
    if (!is_array($specs) && !is_object($specs)) json_response(['error' => '仕様は項目と値のオブジェクトで指定してください。'], 422);
    if (strlen(json_encode($specs, JSON_UNESCAPED_UNICODE) ?: '') > 12000) json_response(['error' => '仕様が長すぎます。'], 422);
    $urls = [];
    foreach (['manufacturerUrl' => 'メーカー情報URL', 'imageUrl' => '商品画像URL', 'productUrl' => '販売元URL'] as $field => $label) {
        $value = trim((string)($input[$field] ?? ''));
        if ($value !== '' && (!filter_var($value, FILTER_VALIDATE_URL) || !in_array(strtolower((string)parse_url($value, PHP_URL_SCHEME)), ['https', 'http'], true))) {
            json_response(['error' => $label . 'はhttpまたはhttpsで入力してください。'], 422);
        }
        if (strlen($value) > 1000) json_response(['error' => $label . 'が長すぎます。'], 422);
        $urls[$field] = $value === '' ? null : $value;
    }
    return [
        'name' => $name,
        'short_name' => mb_substr(trim((string)($input['shortName'] ?? '')) ?: $name, 0, 120),
        'maker' => mb_substr(trim((string)($input['maker'] ?? '')), 0, 100),
        'category' => $category,
        'platform' => $platform,
        'product_type' => $productType,
        'price' => $price,
        'stock' => $stock,
        'description' => mb_substr(trim((string)($input['description'] ?? '')), 0, 2000),
        'specs' => json_encode($specs, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'manufacturer_url' => $urls['manufacturerUrl'],
        'image_url' => $urls['imageUrl'],
        'product_url' => $urls['productUrl'],
        'is_demo_price' => !empty($input['isDemoPrice']) ? 1 : 0,
    ];
}

cors_headers();
