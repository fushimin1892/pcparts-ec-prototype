<?php
declare(strict_types=1);

require_once __DIR__ . '/env.php';

/**
 * Supplier feeds are configured privately by the site operator. There is no
 * default source: an API key or a public product page is not permission to
 * copy a seller's catalog or images into our own product listings.
 */
function reference_feed_source(string $key): ?array
{
    if (!preg_match('/^[a-z0-9][a-z0-9_-]{0,63}$/', $key)) return null;
    $sources = local_app_config()['REFERENCE_FEED_SOURCES'] ?? [];
    if (!is_array($sources)) return null;
    $source = $sources[$key] ?? null;
    if (!is_array($source) || ($source['enabled'] ?? false) !== true) return null;
    $rights = $source['rights'] ?? null;
    if (!is_array($rights) || ($rights['display'] ?? false) !== true ||
        ($rights['cache'] ?? false) !== true || ($rights['images'] ?? false) !== true) return null;
    $permission = trim((string)($source['permissionReference'] ?? ''));
    $name = trim((string)($source['name'] ?? ''));
    $feedUrl = trim((string)($source['feedUrl'] ?? ''));
    if ($permission === '' || mb_strlen($permission) > 500 || $name === '' || mb_strlen($name) > 150 ||
        !reference_https_url($feedUrl, [])) return null;
    foreach (['productHosts', 'imageHosts'] as $field) {
        if (!is_array($source[$field] ?? null) || !$source[$field]) return null;
        foreach ($source[$field] as $host) {
            if (!is_string($host) || !reference_host_name($host)) return null;
        }
    }
    $hours = filter_var($source['maxAgeHours'] ?? null, FILTER_VALIDATE_INT);
    if ($hours === false || $hours < 1 || $hours > 168) return null;
    $source['name'] = $name;
    $source['permissionReference'] = $permission;
    $source['feedUrl'] = $feedUrl;
    $source['maxAgeHours'] = $hours;
    return $source;
}

/** Stop displaying cached offers as soon as a supplier or its rights are disabled. */
function reference_active_sources(): array
{
    $sources = local_app_config()['REFERENCE_FEED_SOURCES'] ?? [];
    if (!is_array($sources)) return [];
    $active = [];
    foreach (array_keys($sources) as $key) {
        $key = (string)$key;
        $source = reference_feed_source($key);
        if ($source !== null) $active[$key] = $source;
    }
    return $active;
}

function reference_host_name(string $host): bool
{
    return (bool)preg_match('/^(?=.{4,253}$)[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i', $host) &&
        !filter_var($host, FILTER_VALIDATE_IP) &&
        !preg_match('/\.(?:local|localhost|internal|test|invalid)$/i', $host);
}

/** An empty host list permits a configured HTTPS feed URL, not an offer URL. */
function reference_https_url(string $value, array $allowedHosts): bool
{
    if (strlen($value) > 1000 || !filter_var($value, FILTER_VALIDATE_URL)) return false;
    $parts = parse_url($value);
    if (!is_array($parts) || strtolower((string)($parts['scheme'] ?? '')) !== 'https' ||
        isset($parts['user']) || isset($parts['pass']) || isset($parts['fragment'])) return false;
    $host = strtolower((string)($parts['host'] ?? ''));
    if (!reference_host_name($host)) return false;
    if (!$allowedHosts) return true;
    foreach ($allowedHosts as $allowed) {
        if ($host === strtolower((string)$allowed)) return true;
    }
    return false;
}

function reference_feed_url(array $source, int $page): string
{
    $separator = str_contains($source['feedUrl'], '?') ? '&' : '?';
    return $source['feedUrl'] . $separator . http_build_query(['page' => $page, 'per_page' => 100], '', '&', PHP_QUERY_RFC3986);
}

function reference_fetch_feed(array $source, int $page): array
{
    if (!function_exists('curl_init')) throw new RuntimeException('cURL is unavailable.');
    $headers = ['Accept: application/json'];
    $headerName = trim((string)($source['authHeaderName'] ?? ''));
    $headerValue = (string)($source['authHeaderValue'] ?? '');
    if ($headerName !== '' || $headerValue !== '') {
        if (!preg_match('/^[A-Za-z0-9-]{1,60}$/', $headerName) || $headerValue === '' ||
            strlen($headerValue) > 2000 || preg_match('/[\r\n]/', $headerValue)) {
            throw new RuntimeException('Supplier feed authorization is invalid.');
        }
        $headers[] = $headerName . ': ' . $headerValue;
    }
    $response = '';
    $curl = curl_init(reference_feed_url($source, $page));
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => false,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_USERAGENT => 'PCPartsShopSupplierSync/1.0',
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_WRITEFUNCTION => static function ($handle, string $chunk) use (&$response): int {
            if (strlen($response) + strlen($chunk) > 2_000_000) return 0;
            $response .= $chunk;
            return strlen($chunk);
        },
    ]);
    $ok = curl_exec($curl);
    $status = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    if ($ok === false || $status !== 200) throw new RuntimeException('Supplier feed request failed with HTTP ' . $status . '.');
    $decoded = json_decode($response, true);
    if (!is_array($decoded) || !is_array($decoded['items'] ?? null) || count($decoded['items']) > 100) {
        throw new RuntimeException('Supplier feed JSON is invalid.');
    }
    return $decoded;
}

function reference_clean_offer(array $item, string $sourceKey, array $source, string $retrievedAt, string $expiresAt): ?array
{
    $externalId = trim((string)($item['id'] ?? ''));
    $name = trim((string)($item['name'] ?? ''));
    $category = trim((string)($item['category'] ?? ''));
    $platform = trim((string)($item['platform'] ?? ''));
    $categories = ['CPU', 'GPU', 'マザーボード', 'SSD', 'メモリ', 'CPUクーラー', 'ファン', 'PCケース', 'PC電源'];
    $price = filter_var($item['price'] ?? null, FILTER_VALIDATE_INT);
    $productUrl = trim((string)($item['productUrl'] ?? ''));
    $imageUrl = trim((string)($item['imageUrl'] ?? ''));
    if ($externalId === '' || mb_strlen($externalId) > 255 || $name === '' || mb_strlen($name) > 255 ||
        !in_array($category, $categories, true) || $price === false || $price < 1 || $price > 4294967295 ||
        !reference_https_url($productUrl, $source['productHosts']) ||
        !reference_https_url($imageUrl, $source['imageHosts'])) return null;
    if (in_array($category, ['CPU', 'マザーボード'], true) && !in_array($platform, ['Intel', 'AMD'], true)) return null;
    if (!in_array($category, ['CPU', 'マザーボード'], true)) $platform = '';
    return [
        'offer_key' => 'ref-' . hash('sha256', $sourceKey . "\0" . $externalId),
        'source_key' => $sourceKey,
        'external_id' => $externalId,
        'source_name' => $source['name'],
        'seller_name' => mb_substr(trim((string)($item['sellerName'] ?? '')), 0, 150),
        'permission_reference' => $source['permissionReference'],
        'name' => $name,
        'maker' => mb_substr(trim((string)($item['maker'] ?? '')), 0, 100),
        'category' => $category,
        'platform' => $platform,
        'price_yen' => $price,
        'image_url' => $imageUrl,
        'product_url' => $productUrl,
        'description' => mb_substr(trim((string)($item['description'] ?? '')), 0, 2000),
        'retrieved_at' => $retrievedAt,
        'expires_at' => $expiresAt,
    ];
}
