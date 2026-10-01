<?php
require_once __DIR__ . '/../../src/bootstrap.php';
try {
    db()->query('SELECT 1');
    json_response(['ok' => true, 'service' => 'pcparts-api', 'database' => 'connected']);
} catch (Throwable $error) {
    error_log('Health check failed: ' . $error->getMessage());
    json_response(['ok' => false, 'error' => 'health check failed'], 503);
}
