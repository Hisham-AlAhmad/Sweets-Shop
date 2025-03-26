<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


require '../database.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM customer");
    $customers = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($customers);
}

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['name']) || !isset($data['phoneNum'])) {
        echo json_encode(["error" => "Name, and phone are required"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO customer (name, phoneNum, address, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("ssi", $data['name'], $data['phoneNum'], $data['address']);
    $stmt->execute();

    if ($conn->query($query)) {
        echo json_encode(["message" => "Customer added"]);
    } else {
        echo json_encode(["error" => "Failed to add customer"]);
    }
}

elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id']) ||!isset($data['name']) ||!isset($data['phoneNum']) ||!isset($data['address'])) {
        echo json_encode(["error" => "ID, name, and phone are required"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE customer SET name = ?, phoneNum = ?, address = ? WHERE id = ?");
    $stmt->bind_param("ssii", $data['name'], $data['phoneNum'], $data['address'], $data['id']);
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