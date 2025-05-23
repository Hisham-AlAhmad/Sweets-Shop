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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    // Only check token for GET, PUT, DELETE requests
    $user = requireAuth();
}

if ($method === 'GET') {

    $query = "SELECT 
                orders.*,
                customer.name AS customer_name,
                GROUP_CONCAT(DISTINCT CONCAT(products.id, '|', products.name, '|',
                 products.image, '|', product_orders.quantity, '|', product_orders.price,
                 '|', product_orders.cost )) AS products
              FROM orders
              LEFT JOIN customer ON orders.customer_id = customer.id
              LEFT JOIN product_orders ON orders.id = product_orders.order_id
              LEFT JOIN products ON product_orders.product_id = products.id
              GROUP BY orders.id
              ORDER BY orders.order_date DESC";

    $result = $conn->query($query);

    while ($row = $result->fetch_assoc()) {
        if(!empty($row['products'])) {
            $productEnteries = explode(',', $row['products']);
            $product_details = [];
            foreach ($productEnteries as $entry) {
                list($id, $name, $image, $quantity, $price, $cost) = explode('|', $entry, 6);
                $product_details[] = ['id' => $id,'name' => $name, 'image' => $image,
                 'quantity' => $quantity, 'price' => $price, 'cost' => $cost];
            }
            $row['products'] = $product_details;
        }
        $orders[] = $row;
    }

    echo json_encode($orders);
}

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['customer_id']) || !isset($data['total_price']) || !isset($data['total_cost']) || !isset($data['products'])) {
        echo json_encode(["error" => "customer_id, total_price, total_cost and products are required"]);
        exit;
    }

    // Insert order
    $stmt = $conn->prepare("INSERT INTO orders (customer_id, total_price, total_cost, order_date) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("iii", $data['customer_id'], $data['total_price'], $data['total_cost']);
    $stmt->execute();
    $order_id = $stmt->insert_id;

    // Insert products into product_orders
    foreach ($data['products'] as $product) {
        $stmt = $conn->prepare("INSERT INTO product_orders (product_id, order_id, quantity, price, cost) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iidii", $product['product_id'], $order_id, $product['quantity'], $product['price'], $product['cost']);
        $stmt->execute();
    }

    echo json_encode(["message" => "Order added successfully", "order_id" => $order_id]);
}

elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id']) || !isset($data['total_price'])) {
        echo json_encode(["error" => "ID and total price are required"]);
        exit;
    }

    // Update order total
    $stmt = $conn->prepare("UPDATE orders SET total_price = ?, total_cost = ? WHERE id = ?");
    $stmt->bind_param("iii", $data['total_price'], $data['total_cost'], $data['id']);
    $stmt->execute();

    // Update product_orders if products are provided
    if (isset($data['products'])) {
        $conn->query("DELETE FROM product_orders WHERE order_id = {$data['id']}");

        foreach ($data['products'] as $product) {
            $stmt = $conn->prepare("INSERT INTO product_orders (product_id, order_id, quantity, price, cost) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("iidi", $product['product_id'], $data['id'], $product['quantity'], $product['price'], $product['cost']);
            $stmt->execute();
        }
    }

    echo json_encode(["message" => "Order updated successfully"]);
}

elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id'])) {
        echo json_encode(["error" => "ID is required"]);
        exit;
    }

    // Delete related product_orders first
    $conn->query("DELETE FROM product_orders WHERE order_id = {$data['id']}");

    // Delete the order
    $stmt = $conn->prepare("DELETE FROM orders WHERE id = ?");
    $stmt->bind_param("i", $data['id']);
    $stmt->execute();

    echo json_encode(["message" => "Order deleted successfully"]);
}

$conn->close();
?>
