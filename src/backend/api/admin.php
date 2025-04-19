<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// run this command to get the vendor folder: composer require firebase/php-jwt

require '../database.php';
require '../auth_utils.php';
use Firebase\JWT\JWT;

// Get the HTTP method and path
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

// Handle requests based on HTTP method and endpoint
switch ($method) {
    case 'POST':
        if ($action === 'login') {
            handleLogin($conn);
        } elseif ($action === 'register') {
            registerAdmin($conn);
        } else {
            sendResponse(404, ['error' => 'Resource not found']);
        }
        break;

    case 'GET':
        if ($action === 'verify') {
            verifyToken($token);
            sendResponse(200, ['message' => 'Token is valid']);
        } else {
            sendResponse(404, ['error' => 'Resource not found']);
        }
        break;

    default:
        sendResponse(405, ['error' => 'Method not allowed']);
}

// Helper function to send JSON responses
function sendResponse($status_code, $data) {
    http_response_code($status_code);
    echo json_encode($data);
    exit;
}

// Function to handle login requests
function handleLogin($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['username']) || !isset($data['password'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'Username and password required']);
        return;
    }

    $username = $data['username'];
    $password = $data['password'];

    $stmt = $conn->prepare("SELECT id, username, password FROM admin WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $admin = $result->fetch_assoc();
        if (password_verify($password, $admin['password'])) {
            $key = 'secret_key';
            $payload = [
                'user_id' => $admin['id'],
                'username' => $admin['username'],
                'exp' => (time() + 5) // Token expires in 1 hour
            ];
            $jwt = JWT::encode($payload, $key, 'HS256');

            echo json_encode([
                'success' => true,
                'token' => $jwt,
                'expires' => $payload['exp'],
                'username' => $admin['username']
            ]);
        } else {
            http_response_code(401); // Unauthorized
            echo json_encode(['error' => 'Invalid credentials']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }

    $stmt->close();
}

// Function to register an admin account (for initial setup)
function registerAdmin($conn){
    // Only allow this function to be called in specific scenarios
    // e.g., initial setup or by a super admin

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['username']) || !isset($data['password']) || !isset($data['setup_key'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }

    // Verify setup key (use a strong, random key in production)
    if ($data['setup_key'] !== 'secure_setup_key') {
        http_response_code(403); // Forbidden
        echo json_encode(['error' => 'Unauthorized']);
        return;
    }

    $username = $data['username'];

    // Hash the password
    $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);

    // Check if username already exists
    $stmt = $conn->prepare("SELECT id FROM admin WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['error' => 'Username already exists']);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Insert new admin
    $stmt = $conn->prepare("INSERT INTO admin (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $password_hash);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Admin account created successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create admin account']);
    }

    $stmt->close();
}

$conn->close();
?>