<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require '../database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $query = "SELECT products.*, GROUP_CONCAT(category.name) AS category 
              FROM products 
              LEFT JOIN product_category ON products.id = product_category.product_id 
              LEFT JOIN category ON product_category.category_id = category.id 
              GROUP BY products.id";
    $result = $conn->query($query);
    
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $row['category'] = $row['category'] ? explode(',', $row['category']) : [];
        $products[] = $row;
    }

    echo json_encode($products);
}

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['name']) || !isset($data['image']) || !isset($data['category'])) {
        echo json_encode(["message" => "Missing required fields"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO products (name, image, description, weight_price, availability, created_at) VALUES (?, ?, ?, ?, ?, NOW()");
    $stmt->bind_param("sssii", $data['name'], $data['image'], $data['description'], $data['weight_price'], $data['availability']);
    $stmt->execute();
    $product_id = $stmt->insert_id;

    foreach ($data['category'] as $category_id) {
        $conn->query("INSERT INTO product_category (product_id, category_id) VALUES ($product_id, $category_id)");
    }

    if (isset($data['sizes'])) {
        foreach ($data['sizes'] as $size) {
            // Expecting each size as an array with sizes_id and price.
            $sizes_id = $size['sizes_id'];
            $price    = $size['price'];
            $conn->query("INSERT INTO product_sizes (product_id, sizes_id, price) VALUES ($product_id, $sizes_id, $price)");
        }
    }

    echo json_encode(["message" => "Product added successfully"]);
}

elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id']) || !isset($data['name']) || !isset($data['image']) || !isset($data['category'])) {
        echo json_encode(["message" => "Missing required fields"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE products SET name=?, image=?, description=?, weight_price=?, availability=?, updated_at=NOW() WHERE id=?");
    $stmt->bind_param("sssiii", $data['name'], $data['image'], $data['description'], $data['weight_price'], $data['availability'], $data['id']);
    $stmt->execute();

    $conn->query("DELETE FROM product_category WHERE product_id={$data['id']}");
    foreach ($data['category'] as $category_id) {
        $conn->query("INSERT INTO product_category (product_id, category_id) VALUES ({$data['id']}, $category_id)");
    }

    if (isset($data['sizes'])) {
        // First, remove existing size
        $conn->query("DELETE FROM product_sizes WHERE product_id={$data['id']} and sizes_id = {$data['sizes']}");
        // Then, insert the new sizes
        foreach ($data['sizes'] as $size) {
            $sizes_id = $size['sizes_id'];
            $price    = $size['price'];
            $conn->query("INSERT INTO product_sizes (product_id, sizes_id, price) VALUES ({$data['id']}, $sizes_id, $price)");
        }
    }
    
    echo json_encode(["message" => "Product updated successfully"]);
}

elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id'])) {
        echo json_encode(["message" => "Missing product ID"]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM products WHERE id=?");
    $stmt->bind_param("i", $data['id']);
    $stmt->execute();

    echo json_encode(["message" => "Product deleted successfully"]);
}

else {
    echo json_encode(["message" => "Invalid request method"]);
}
?>