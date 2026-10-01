<?php
declare(strict_types=1);

function local_app_config(): array
{
    static $config = null;
    if (is_array($config)) return $config;
    $path = dirname(__DIR__) . '/config.local.php';
    $loaded = is_file($path) ? require $path : [];
    $config = is_array($loaded) ? $loaded : [];
    return $config;
}

function env_value(string $name, ?string $fallback = null): ?string
{
    $value = getenv($name);
    if ($value !== false && $value !== '') return $value;
    $configured = local_app_config()[$name] ?? null;
    return is_scalar($configured) && (string)$configured !== '' ? (string)$configured : $fallback;
}
