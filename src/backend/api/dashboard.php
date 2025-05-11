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
    $query = "SELECT SUM((total_price - total_cost)) as revenue FROM orders";
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
   $years = [];
    while ($row = $result->fetch_assoc()) {
        $years[] = $row['years'];
    }
    echo json_encode($years);
}

function getProfitData($conn){
    $range = $_GET['range'];

    if ($range == '3months') {
        // Start from previous month and include 3 months
        $start_date = date('Y-m-01', strtotime('-2 months')); // 2 months ago, 1st day
        $end_date = date('Y-m-d'); // Today
        $where = "order_date >= '$start_date'";
    }
    else if ($range == '6months') {
        // Start from previous month and include 6 months
        $start_date = date('Y-m-01', strtotime('-5 months')); // 5 months ago, 1st day
        $end_date = date('Y-m-d'); // Today
        $where = "order_date >= '$start_date'";
    }
    else if (is_numeric($range)) {
        // Specific year
        $year = intval($range);
        $where = "YEAR(order_date) = " . $year;
        $start_date = "$year-01-01"; // January 1st of specified year
        $end_date = "$year-12-31"; // December 31st of specified year
    }
    else {
        // Default to current year
        $year = date('Y');
        $where = "YEAR(order_date) = YEAR(CURDATE())";
        $start_date = "$year-01-01"; // January 1st of current year
        $end_date = date('Y-m-d'); // Today
    }

    $query = "SELECT YEAR(order_date) AS year, 
            MONTH(order_date) AS month,
            SUM(total_price - total_cost) AS profit
            FROM orders
            WHERE $where
            GROUP BY YEAR(order_date), MONTH(order_date)
            ORDER BY YEAR(order_date), MONTH(order_date)";

    $result = $conn->query($query);
    $db_monthly_profit = [];
    $monthly_profit = [];

    while ($row = $result->fetch_assoc()) {
        $db_monthly_profit[] = $row;
    }
    
    // Convert date strings to DateTime objects
    $start = new DateTime($start_date);
    $end = new DateTime($end_date);
    $interval = new DateInterval('P1M'); // P1M means "Period of 1 Month", 1 month interval
    $period = new DatePeriod($start, $interval, $end);
    
    // Initialize all months with zero profit
    foreach ($period as $dt) {
        $year = $dt->format('Y');
        $month = (int)$dt->format('n'); // 1-12 month format
        
        $monthly_profit[] = [
            'year' => (int)$year,
            'month' => date('M', mktime(0, 0, 0, $month, 1)), // Abbreviated month name (Jan, Feb, etc.)
            'month_num' => $month, // Keep the month number for internal matching
            'profit' => 0
        ];
    }

    // Update with actual profit data from database
    foreach ($db_monthly_profit as $data) {
        $year = (int)$data['year'];
        $month = (int)$data['month'];

        // Find and update the corresponding month in our array
        foreach ($monthly_profit as &$item) {
            if ($item['year'] === $year && $item['month_num'] === $month) {
                $item['profit'] = (float)$data['profit'];
                break;
            }
        }
    }

    // Remove the month_num from final output - it was just for internal matching
    foreach ($monthly_profit as &$item) {
        unset($item['month_num']);
    }
    echo json_encode($monthly_profit);
}
?>