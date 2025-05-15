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
        } else if ($action === 'update') {
            updateAdmin($conn);
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

    $stmt = $conn->prepare("SELECT id, username, password, image FROM admin WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $admin = $result->fetch_assoc();
        if (password_verify($password, $admin['password'])) {
            
            $key = $_ENV['JWT_SECRET_KEY'];
            $payload = [
                'user_id' => $admin['id'],
                'username' => $admin['username'],
                'image' => $admin['image'],
                'exp' => (time() + 3600) // Token expires in 1 hour
            ];
            $jwt = JWT::encode($payload, $key, 'HS256');

            echo json_encode([
                'success' => true,
                'token' => $jwt,
                'expires' => $payload['exp'],
                'username' => $admin['username'],
                'image' => $admin['image']
            ]);
        } else {
            http_response_code(401); // Unauthorized
            echo json_encode(['error' => 'Error: Invalid Username or Password']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Error: Invalid credentials']);
    }

    $stmt->close();
}

// Function to register an admin account (for initial setup)
function registerAdmin($conn){
    $data = $_POST;

    if (!isset($data['username']) || !isset($data['password']) || !isset($data['setup_key'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Error: Missing required fields']);
        return;
    }

    // Verify setup key (use a strong, random key in production)
    $setupKey = $_ENV['SETUP_KEY'];
    if ($data['setup_key'] !== $setupKey) {
        http_response_code(403); // Forbidden
        echo json_encode(['error' => 'Error: Unauthorized']);
        return;
    }

    $username = $data['username'];
    $password_hash = password_hash($data['password'], PASSWORD_DEFAULT); // Hash the password
    $image = isset($_FILES['image']) ? $_FILES['image'] : null; // Optional image field

    $image_name = null;
    // Process image upload
    if ($image && $image['error'] == 0) {
        $upload_dir = '../../../public/img/user/';
        $image_name = basename($image['name']);
        $target_path = $upload_dir . $image_name;
        if (!move_uploaded_file($image['tmp_name'], $target_path)) {
            echo json_encode(["error" => "Failed to upload image"]);
            exit;
        }
    }

    // Check if username already exists
    $stmt = $conn->prepare("SELECT id FROM admin WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['error' => 'Error: Username already exists']);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Insert new admin
    if ($image_name) { // If an image was uploaded
        $stmt = $conn->prepare("INSERT INTO admin (username, password, image) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $password_hash, $image_name);
    }
    else { // If no image was uploaded
        $stmt = $conn->prepare("INSERT INTO admin (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $password_hash);
    }

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Admin account created successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error: Failed to create admin account']);
    }

    $stmt->close();
}

// Function to update admin information
function updateAdmin($conn) {
    // Use the existing requireAuth function to verify token and get user info
    $decoded = requireAuth();
    $user_id = $decoded->user_id;
    
    $data = $_POST;

    $username = $data['username'];
    $password_hash = password_hash($data['password'], PASSWORD_DEFAULT); // Hash the password
    $image = isset($_FILES['image']) ? $_FILES['image'] : null; // Optional image field

    // Check if username is being updated
    if (isset($username)) {
        // Check if the new username already exists (excluding the current user)
        $check_stmt = $conn->prepare("SELECT id FROM admin WHERE username = ?");
        $check_stmt->bind_param("s", $username);
        $check_stmt->execute();
        if ($check_stmt->get_result()->num_rows > 1) {
            $check_stmt->close();
            sendResponse(409, ['error' => 'Username already exists']);
            return;
        }
        $check_stmt->close();
    }

    // Check if image is being updated
    $image_name = null;
    if ($image && $image['error'] == 0) {
        $upload_dir = '../../../public/img/user/';
        $image_name = basename($image['name']);
        $target_path = $upload_dir . $image_name;
        
        if (!move_uploaded_file($image['tmp_name'], $target_path)) {
            sendResponse(500, ['error' => 'Failed to upload image']);
            return;
        }
    }

    // Update the admin
    if ($image_name) { // If an image was uploaded
        $stmt = $conn->prepare("UPDATE admin SET username = ?, password = ?, image = ? WHERE id = ?");
        $stmt->bind_param("sssi", $username, $password_hash, $image_name, $user_id);
    }
    else { // If no image was uploaded
        $stmt = $conn->prepare("UPDATE admin SET username = ?, password = ? WHERE id = ?");
        $stmt->bind_param("ssi", $username, $password_hash, $user_id);
    }

    
    if ($stmt->execute()) {
        sendResponse(200, [
            'success' => true,
            'message' => 'Admin updated successfully, Logging out...',
        ]);
    } else {
        sendResponse(500, ['error' => 'Failed to update admin information']);
    }
    
    $stmt->close();
}

$conn->close();
?>