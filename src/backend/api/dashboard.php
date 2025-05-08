<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// run this command to get the vendor folder: composer require firebase/php-jwt

require '../database.php';
require '../auth_utils.php';

// Get the HTTP method and path
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

if ($method === 'GET'){
    if ($action === 'totalOrders'){
        getTotalOrders($conn);
    } elseif ($action === 'totalProducts'){
        getTotalProducts($conn);
    } elseif ($action === 'totalRevenue'){
        getTotalRevenue($conn); 
    } elseif ($action === 'totalCustomers'){
        getTotalCustomers($conn);  
    } elseif ($action === 'categoryRevenue'){
        getCategoryRevenue($conn);
    } elseif ($action === 'filteredYears') {
        getFilteredYears($conn);
    } elseif ($action === 'profitData') {
        getProfitData($conn);
    }
}

function getTotalOrders($conn){
    $query = "SELECT COUNT(*) as orders FROM orders";
    $result = $conn->query($query);
    $total_orders = $result->fetch_assoc();
    echo json_encode($total_orders['orders']);
}

function getTotalProducts($conn){
    $query = "SELECT COUNT(*) as products FROM products";
    $result = $conn->query($query);
    $total_products = $result->fetch_assoc();
    echo json_encode($total_products['products']);
}

function getTotalRevenue($conn){
    $query = "SELECT SUM(total_price) as revenue FROM orders";
    $result = $conn->query($query);
    $total_revenue = $result->fetch_assoc();
    echo json_encode($total_revenue['revenue']);
}

function getTotalCustomers($conn){
    $query = "SELECT COUNT(*) as customer FROM customer";
    $result = $conn->query($query);
    $total_customers = $result->fetch_assoc();
    echo json_encode($total_customers['customer']);
}

function getCategoryRevenue($conn){
    $query = "SELECT category.name, SUM(product_orders.price * product_orders.quantity) as revenue
              FROM category
              LEFT JOIN product_category ON category.id = product_category.category_id
              LEFT JOIN products ON product_category.product_id = products.id
              LEFT JOIN product_orders ON products.id = product_orders.product_id
              LEFT JOIN orders ON product_orders.order_id = orders.id
              GROUP BY category.name";
    $result = $conn->query($query);
    $category_revenue = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($category_revenue);
}

function getFilteredYears($conn){
    $query = "SELECT DISTINCT YEAR(order_date) as years FROM orders ORDER BY years DESC";
    $result = $conn->query($query);
    $years = $result->fetch_assoc();
    echo json_encode($years);
}

function getProfitData($conn){
    $range = $_GET['range'];

    if ($range == 'month') {
        $where = "order_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')";
    }
    else if ($range == '3months') {
        $where = "order_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)";
    }
    else if ($range == '6months') {
        $where = "order_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)";
    }
    else if (is_numeric($range)) {
        $where = "YEAR(order_date) = " . intval($range);
    }
    else {
        $where = "YEAR(order_date) = YEAR(CURDATE())";
    }

    $query = "SELECT YEAR(order_date) AS year, 
            MONTH(order_date) AS month,
            SUM(total_price)  AS profit
            FROM orders
            WHERE $where
            GROUP BY YEAR(order_date), MONTH(order_date)
            ORDER BY YEAR(order_date), MONTH(order_date)";

    $result = $conn->query($query);
    $monthly_profit = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($monthly_profit);
}
?>