<?php
declare(strict_types=1);

$config = require __DIR__ . '/../src/seed_config.php';
$dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $config['host'], $config['port'], $config['name']);
$pdo = new PDO($dsn, $config['user'], $config['password'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$seedPath = __DIR__ . '/../../database/seed_products.json';
if (!is_file($seedPath)) $seedPath = '/var/www/database/seed_products.json';
$items = json_decode(file_get_contents($seedPath) ?: '[]', true, 512, JSON_THROW_ON_ERROR);
$statement = $pdo->prepare('INSERT IGNORE INTO products (catalog_key, name, short_name, maker, category, product_type, price, manufacturer_url, specs, is_demo_price, stock, description, is_active) VALUES (:catalog_key, :name, :short_name, :maker, :category, :product_type, :price, :manufacturer_url, :specs, :is_demo_price, :stock, :description, TRUE)');
foreach ($items as $item) {
    $statement->execute([
        'catalog_key' => $item['id'],
        'name' => $item['name'],
        'short_name' => $item['shortName'] ?? $item['name'],
        'maker' => $item['maker'] ?? '',
        'category' => $item['category'],
        'product_type' => $item['type'] ?? 'other',
        'price' => $item['price'],
        'manufacturer_url' => $item['manufacturerUrl'] ?? null,
        'specs' => json_encode($item['specs'] ?? new stdClass(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'is_demo_price' => !empty($item['isDemoPrice']) ? 1 : 0,
        'stock' => $item['stock'] ?? 0,
        'description' => $item['description'] ?? '',
    ]);
}
echo sprintf("Catalog ready: %d bundled product records (%d CPUs).\n", count($items), count(array_filter($items, static fn(array $item): bool => $item['category'] === 'CPU')));
