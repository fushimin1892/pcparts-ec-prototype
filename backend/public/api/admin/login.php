<?php
require_once __DIR__ . '/../../../src/bootstrap.php';
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') json_response(['error' => 'POSTで送信してください。'], 405);
$input = json_body();
$email = mb_substr(trim((string)($input['email'] ?? '')), 0, 255);
$password = (string)($input['password'] ?? '');
if ($email === '' || $password === '') json_response(['error' => 'メールアドレスとパスワードを入力してください。'], 422);
$stmt = db()->prepare("SELECT id, email, password_hash, name FROM users WHERE email = ? AND role = 'admin' LIMIT 1");
$stmt->execute([$email]);
$admin = $stmt->fetch();
if (!$admin || !password_verify($password, $admin['password_hash'])) json_response(['error' => 'メールアドレスまたはパスワードが違います。'], 401);
start_app_session();
session_regenerate_id(true);
$_SESSION['role'] = 'admin';
$_SESSION['user_id'] = (int)$admin['id'];
$_SESSION['admin_email'] = $admin['email'];
json_response(['ok' => true, 'admin' => ['email' => $admin['email'], 'name' => $admin['name']]]);
