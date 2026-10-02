<?php
require_once __DIR__ . '/../../../src/bootstrap.php';
json_response(['authenticated' => admin_authenticated()]);
