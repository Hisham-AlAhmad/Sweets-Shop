<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


require '../database.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM suppliers");
    $supplierss = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($supplierss);
}

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['name']) || !isset($data['phoneNumb']) || !isset($data['address'])) {
        echo json_encode(["error" => "Name, phoneNum, and address are required"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO suppliers (name, phoneNum, address, products_supplied) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $data['name'], $data['phoneNum'], $data['address'], $data['products_supplied']);
    $stmt->execute();

    if ($conn->query($query)) {
        echo json_encode(["message" => "suppliers added"]);
    } else {
        echo json_encode(["error" => "Failed to add suppliers"]);
    }
}

elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id']) ||!isset($data['name']) ||!isset($data['phoneNum']) ||!isset($data['address'])) {
        echo json_encode(["error" => "ID, name, phoneNum, and address are required"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE suppliers SET name = ?, phoneNum = ?, address = ? WHERE id = ?");
    $stmt->bind_param("ssii", $data['name'], $data['phoneNum'], $data['address'], $data['id']);
    $stmt->execute();

    echo json_encode(["message" => "suppliers updated successfully"]);
}

elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id'])) {
        echo json_encode(["error" => "ID is required"]);
        exit;
    }
    $stmt = $conn->prepare("DELETE FROM suppliers WHERE id =?");
    $stmt->bind_param("i", $data['id']);
    $stmt->execute();

    echo json_encode(["message" => "suppliers deleted successfully"]);
}

$conn->close();
?>