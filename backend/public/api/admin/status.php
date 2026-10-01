<?php
require_once __DIR__ . '/../../../src/bootstrap.php';
start_app_session();
json_response(['authenticated' => ($_SESSION['role'] ?? null) === 'admin']);
