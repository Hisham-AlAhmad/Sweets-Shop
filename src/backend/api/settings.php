<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require '../database.php';
require '../auth_utils.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check authentication for all methods except GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    $user = requireAuth();
}

if ($method === 'GET') {
    // Fetch settings (only one row)
    $query = "SELECT * FROM settings LIMIT 1";
    $result = $conn->query($query);
    $settings = $result->fetch_assoc();
    echo json_encode($settings);
}

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if required fields are present
    $requiredFields = ['openingTime', 'closingTime', 'daysOpen', 'isOpen', 'deliveryCost', 'storeAddress', 'phoneNum'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            echo json_encode(["error" => "$field is required"]);
            exit;
        }
    }

    // Check if settings already exist
    $checkQuery = "SELECT id FROM settings LIMIT 1";
    $checkResult = $conn->query($checkQuery);
    
    if ($checkResult->num_rows > 0) {
        echo json_encode(["error" => "Settings already exist. Use PUT to update."]);
        exit;
    }

    // Process the data - escape strings and format correctly
    $openingTime = $conn->real_escape_string($data['openingTime']);
    $closingTime = $conn->real_escape_string($data['closingTime']);
    $daysOpen = $conn->real_escape_string($data['daysOpen']);
    $isOpen = $data['isOpen'] ? 1 : 0;
    $deliveryCost = floatval($data['deliveryCost']);
    $storeAddress = $conn->real_escape_string($data['storeAddress']);
    $phoneNum = $conn->real_escape_string($data['phoneNum']);
    
    $query = "INSERT INTO settings (opening_time, closing_time, days_open, is_open, delivery_cost, store_address, phoneNum) 
              VALUES ('$openingTime', '$closingTime', '$daysOpen', $isOpen, $deliveryCost, '$storeAddress', '$phoneNum')";
    
    if ($conn->query($query)) {
        echo json_encode(["message" => "Settings created successfully", "id" => $conn->insert_id]);
    } else {
        echo json_encode(["error" => "Failed to create settings: " . $conn->error]);
    }
}

elseif ($method === 'PUT') {
    // Update settings
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if required fields are present
    $requiredFields = ['openingTime', 'closingTime', 'daysOpen', 'isOpen', 'deliveryCost', 'storeAddress', 'phoneNum'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            echo json_encode(["error" => "$field is required"]);
            exit;
        }
    }

    // Process the data - escape strings and format correctly
    $openingTime = $conn->real_escape_string($data['openingTime']);
    $closingTime = $conn->real_escape_string($data['closingTime']);
    $daysOpen = $conn->real_escape_string($data['daysOpen']);
    $isOpen = $data['isOpen'] ? 1 : 0;
    $deliveryCost = floatval($data['deliveryCost']);
    $storeAddress = $conn->real_escape_string($data['storeAddress']);
    $phoneNum = $conn->real_escape_string($data['phoneNum']);

    // Check if settings exist
    $checkQuery = "SELECT id FROM settings LIMIT 1";
    $checkResult = $conn->query($checkQuery);

    if ($checkResult->num_rows > 0) {
        // Get the ID of the existing row
        $row = $checkResult->fetch_assoc();
        $id = $row['id'];

        // Update existing settings
        $query = "UPDATE settings SET 
                  opening_time = '$openingTime', 
                  closing_time = '$closingTime', 
                  days_open = '$daysOpen', 
                  is_open = $isOpen, 
                  delivery_cost = $deliveryCost, 
                  store_address = '$storeAddress', 
                  phoneNum = '$phoneNum' 
                  WHERE id = $id";

        if ($conn->query($query)) {
            echo json_encode(["message" => "Settings updated successfully"]);
        } else {
            echo json_encode(["error" => "Failed to update settings: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Failed to create settings: " . $conn->error]);
    }
}

$conn->close();
?>