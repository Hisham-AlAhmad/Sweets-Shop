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

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    // Only check token for POST, PUT, DELETE requests
    $user = requireAuth();
}

if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM feedback"); 
    
    $feedback = [];
    while ($row = $result->fetch_assoc()) {
        if ($row['approved'] == 1) {
            $feedback[] = $row;
        }
    }
    echo json_encode($feedback);
}

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $conn->prepare("INSERT INTO feedback (name, comment, created_at) VALUES (?, ?, NOW())");
    $stmt->bind_param("ss", $data['name'], $data['comment']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["message" => "Comment added to be reviewed"]);
    } else {
        echo json_encode(["error" => "Failed to add Comment"]);
    }
}

elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    $current_query = "SELECT comment FROM feedback WHERE id = ?";
    $stmt = $conn->prepare($current_query);
    $stmt->bind_param("i", $data['id']);
    $stmt->execute();
    $result = $stmt->get_result();

    
    if (!isset($data['comment'])) {
        $data['comment'] = $result->fetch_assoc()['comment'];
    }
    
    if (!isset($data['name']) ) {
        $stmt = $conn->prepare("UPDATE feedback SET comment = ?, approved = ? WHERE id = ?");
        $stmt->bind_param("sii", $data['comment'], $data['approved'], $data['id']);
    }else{
        $stmt = $conn->prepare("UPDATE feedback SET name = ?, comment = ?, approved = ? WHERE id = ?");
        $stmt->bind_param("ssii", $data['name'], $data['comment'], $data['approved'], $data['id']);
    }
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