<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


require '../database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Extract ID from URL path if present
    $path_info = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
    $phoneNum = null;
    
    if (!empty($path_info)) {
        // Remove leading slash
        $phoneNum = ltrim($path_info, '/');
        $result = $conn->query("SELECT id from customer WHERE phoneNum = '$phoneNum'");
    }else {
        $result = $conn->query("SELECT * FROM customer");
    }
    $customers = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($customers);
}

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['name']) || !isset($data['phoneNum']) || !isset($data['address'])) {
        echo json_encode(["error" => "Name, phone and address are required"]);
        exit;
    }

    // Check if the phone number already exists
    $stmt = $conn->prepare("SELECT id FROM customer WHERE phoneNum = ?");
    $stmt->bind_param("s", $data['phoneNum']);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        exit;
    }
    else{
        $stmt = $conn->prepare("INSERT INTO customer (name, phoneNum, address) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $data['name'], $data['phoneNum'], $data['address']);
        $stmt->execute();
    }
    // Insert new customer

    echo json_encode(["message" => "Customer added successfully"]);
}


elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id']) ||!isset($data['name']) ||!isset($data['phoneNum']) ||!isset($data['address'])) {
        echo json_encode(["error" => "ID, name, and phone are required"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE customer SET name = ?, phoneNum = ?, address = ? WHERE id = ?");
    $stmt->bind_param("sssi", $data['name'], $data['phoneNum'], $data['address'], $data['id']);
    $stmt->execute();

    echo json_encode(["message" => "Customer updated successfully"]);
}

elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id'])) {
        echo json_encode(["error" => "ID is required"]);
        exit;
    }
    $stmt = $conn->prepare("DELETE FROM customer WHERE id =?");
    $stmt->bind_param("i", $data['id']);
    $stmt->execute();

    echo json_encode(["message" => "Customer deleted successfully"]);
}

$conn->close();
?>