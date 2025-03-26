<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require '../database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Check if we're getting feedback for a specific customer
    if (isset($_GET['customer_id'])) {
        $customer_id = $conn->real_escape_string($_GET['customer_id']);
        $result = $conn->query("SELECT * FROM feedback WHERE customer_id = $customer_id");
    } else {
        // Or all feedback if no customer_id specified
        $result = $conn->query("SELECT * FROM feedback");
    }
    
    $feedback = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($feedback);
}

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['customer_id']) || !isset($data['comment'])) {
        echo json_encode(["error" => "customer_id and comment are required"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO feedback (customer_id, comment, approved, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("isi", $data['customer_id'], $data['comment'], $data['approved']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["message" => "Feedback added"]);
    } else {
        echo json_encode(["error" => "Failed to add feedback"]);
    }
}

elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id']) || !isset($data['comment'])) {
        echo json_encode(["error" => "ID and comment are required"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE feedback SET comment = ?, approved = ? WHERE id = ?");
    $stmt->bind_param("sii", $data['comment'], $data['approved'], $data['id']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["message" => "Feedback updated successfully"]);
    } else {
        echo json_encode(["error" => "No changes made or feedback not found"]);
    }
}

elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id'])) {
        echo json_encode(["error" => "ID is required"]);
        exit;
    }
    
    $stmt = $conn->prepare("DELETE FROM feedback WHERE id = ?");
    $stmt->bind_param("i", $data['id']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["message" => "Feedback deleted successfully"]);
    } else {
        echo json_encode(["error" => "Feedback not found"]);
    }
}

$conn->close();
?>