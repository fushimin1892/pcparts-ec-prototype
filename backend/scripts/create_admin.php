<?php
declare(strict_types=1);
$config = require __DIR__ . '/../src/seed_config.php';
$dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $config['host'], $config['port'], $config['name']);
$pdo = new PDO($dsn, $config['user'], $config['password'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$email = strtolower(trim($argv[1] ?? ''));
$name = trim($argv[2] ?? '管理者');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "Usage: php backend/scripts/create_admin.php admin@example.com [display name]\n");
    exit(2);
}
$password = getenv('ADMIN_PASSWORD') ?: (function_exists('readline') ? readline('Admin password (12+ chars): ') : '');
if (strlen($password) < 12) {
    fwrite(STDERR, "Set ADMIN_PASSWORD or enter a password of at least 12 characters.\n");
    exit(2);
}
$stmt = $pdo->prepare("INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'admin') ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), name=VALUES(name), role='admin'");
$stmt->execute([$email, password_hash($password, PASSWORD_DEFAULT), mb_substr($name, 0, 100)]);
echo "Admin account created or updated. Password was not printed.\n";
