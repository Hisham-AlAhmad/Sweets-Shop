<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


require '../database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch all categories
    $query = "SELECT * FROM category";
    $result = $conn->query($query);
    $categories = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($categories);
}

elseif ($method === 'POST') {
    // Add new category
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['name'])) {
        echo json_encode(["error" => "Category name is required"]);
        exit;
    }

    $name = $conn->real_escape_string($data['name']);
    $query = "INSERT INTO category (name, created_at) VALUES ('$name', NOW())";

    if ($conn->query($query)) {
        echo json_encode(["message" => "Category added"]);
    } else {
        echo json_encode(["error" => "Failed to add category"]);
    }
}

elseif ($method === 'PUT') {
    // Update category
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id'], $data['name'])) {
        echo json_encode(["error" => "ID and name are required"]);
        exit;
    }

    $id = intval($data['id']);
    $name = $conn->real_escape_string($data['name']);
    $query = "UPDATE category SET name='$name' WHERE id=$id";

    if ($conn->query($query)) {
        echo json_encode(["message" => "Category updated"]);
    } else {
        echo json_encode(["error" => "Failed to update category"]);
    }
}

elseif ($method === 'DELETE') {
    // Delete category
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id'])) {
        echo json_encode(["error" => "ID is required"]);
        exit;
    }

    $id = intval($data['id']);
    $query = "DELETE FROM category WHERE id=$id";

    if ($conn->query($query)) {
        echo json_encode(["message" => "Category deleted"]);
    } else {
        echo json_encode(["error" => "Failed to delete category"]);
    }
}

$conn->close();
?>