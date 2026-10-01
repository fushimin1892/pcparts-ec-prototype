<?php
require_once __DIR__ . '/../../../src/bootstrap.php';
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') json_response(['error' => 'POSTで送信してください。'], 405);
start_app_session();
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
}
session_destroy();
json_response(['ok' => true]);
