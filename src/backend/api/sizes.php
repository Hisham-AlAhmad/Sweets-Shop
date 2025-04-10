<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


require '../database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch all categories
    $query = "SELECT * FROM sizes";
    $result = $conn->query($query);
    $sizes = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($sizes);
}

elseif ($method === 'POST') {
    // Add new size
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['name'])) {
        echo json_encode(["error" => "Size name is required"]);
        exit;
    }

    $name = $conn->real_escape_string($data['name']);
    $query = "INSERT INTO sizes (name) VALUES ('$name')";

    if ($conn->query($query)) {
        echo json_encode(["message" => "Size added"]);
    } else {
        echo json_encode(["error" => "Failed to add Size"]);
    }
}

elseif ($method === 'PUT') {
    // Update size
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id'], $data['name'])) {
        echo json_encode(["error" => "ID and name are required"]);
        exit;
    }

    $id = intval($data['id']);
    $name = $conn->real_escape_string($data['name']);
    $query = "UPDATE sizes SET name='$name' WHERE id=$id";

    if ($conn->query($query)) {
        echo json_encode(["message" => "Size updated"]);
    } else {
        echo json_encode(["error" => "Failed to update Size"]);
    }
}

elseif ($method === 'DELETE') {
    // Delete size
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id'])) {
        echo json_encode(["error" => "ID is required"]);
        exit;
    }

    $id = intval($data['id']);
    $query = "DELETE FROM sizes WHERE id=$id";

    if ($conn->query($query)) {
        echo json_encode(["message" => "Size deleted"]);
    } else {
        echo json_encode(["error" => "Failed to delete Size"]);
    }
}

$conn->close();
?>