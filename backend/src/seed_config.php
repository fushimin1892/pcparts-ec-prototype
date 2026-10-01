<?php
require_once __DIR__ . '/env.php';
return [
    'host' => env_value('DB_HOST', '127.0.0.1'),
    'port' => env_value('DB_PORT', '3306'),
    'name' => env_value('DB_NAME', 'pc_parts_shop'),
    'user' => env_value('DB_USER', 'pcparts'),
    'password' => env_value('DB_PASSWORD', ''),
];
