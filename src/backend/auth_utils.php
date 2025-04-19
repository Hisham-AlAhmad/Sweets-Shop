<?php
//   Fresh-time/src/backend/auth_utils.php
require '../../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function verifyToken($token) {
    $key = 'secret_key';
    try {
        return JWT::decode($token, new Key($key, 'HS256'));
    } catch (Exception $e) {
        return false;
    }
}

function requireAuth() {
    $headers = getallheaders();

    if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'] ?? '', $matches)) {
        $token = $matches[1];
        $decoded = verifyToken($token);
        
        if (!$decoded) {
            http_response_code(401); // Unauthorized
            echo json_encode(['error' => 'Invalid or expired token']);
            exit;
        }

        return $decoded;
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(['error' => 'Missing token']);
        exit;
    }
}
