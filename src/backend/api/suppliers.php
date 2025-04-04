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
    if (!isset($data['name']) || !isset($data['phoneNum']) || !isset($data['address'])) {
        echo json_encode(["error" => "Name, phone Number, and address are required"]);
        exit;
    }

    $name = $conn->real_escape_string($data['name']);
    $phoneNum = $conn->real_escape_string($data['phoneNum']);
    $address = $conn->real_escape_string($data['address']);
    $products_supplied = $conn->real_escape_string($data['products_supplied']);

    $query = "INSERT INTO suppliers (name, phoneNum, address, products_supplied) VALUES ('$name', '$phoneNum', '$address', '$products_supplied')";

    if ($conn->query($query)) {
        echo json_encode(["message" => "supplier added"]);
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

    $stmt = $conn->prepare("UPDATE suppliers SET name = ?, phoneNum = ?, address = ?, products_supplied = ? WHERE id = ?");
    $stmt->bind_param("ssssi", $data['name'], $data['phoneNum'], $data['address'], $data['products_supplied'], $data['id']);
    $stmt->execute();

    echo json_encode(["message" => "supplier updated successfully"]);
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