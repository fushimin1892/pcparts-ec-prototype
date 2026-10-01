<?php
return [
    'host' => getenv('DB_HOST') ?: '127.0.0.1',
    'port' => getenv('DB_PORT') ?: '3306',
    'name' => getenv('DB_NAME') ?: 'pc_parts_shop',
    'user' => getenv('DB_USER') ?: 'pcparts',
    'password' => getenv('DB_PASSWORD') ?: '',
];
