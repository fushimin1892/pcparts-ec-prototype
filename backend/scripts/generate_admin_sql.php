<?php
declare(strict_types=1);

$email = strtolower(trim($argv[1] ?? ''));
$name = trim($argv[2] ?? 'ショップ管理者');
$password = getenv('ADMIN_PASSWORD') ?: '';
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 12) {
    fwrite(STDERR, "Set ADMIN_PASSWORD (12+ characters) and run: php generate_admin_sql.php admin@example.com [display name]\n");
    exit(2);
}

$quote = static fn(string $value): string => "'" . str_replace("'", "''", $value) . "'";
$hash = password_hash($password, PASSWORD_DEFAULT);
$sql = 'INSERT INTO users (email, password_hash, name, role) VALUES (' . implode(', ', [
    $quote($email), $quote($hash), $quote(mb_substr($name, 0, 100)), "'admin'",
]) . ') ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), name=VALUES(name), role=\'admin\';';
fwrite(STDOUT, $sql . PHP_EOL);
