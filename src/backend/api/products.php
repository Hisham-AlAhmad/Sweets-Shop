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
    // Extract ID from URL path if present
    $path_info = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
    $id = null;
    
    if (!empty($path_info)) {
        // Remove leading slash and convert to integer
        $id = intval(ltrim($path_info, '/'));
    }

    $query = "SELECT 
                products.*, 
                GROUP_CONCAT(DISTINCT CONCAT(category.id, '|', category.name)) AS category,
                GROUP_CONCAT(DISTINCT CONCAT(sizes.id, '|', sizes.name, '|', product_sizes.price)) AS sizes
              FROM products
              LEFT JOIN product_category ON products.id = product_category.product_id
              LEFT JOIN category ON product_category.category_id = category.id
              LEFT JOIN product_sizes ON products.id = product_sizes.product_id
              LEFT JOIN sizes ON product_sizes.sizes_id = sizes.id";

    if ($id) {
        $condition = ' WHERE products.id = ' . $id;
        $query = $query . $condition;
    }

    $query = $query . " GROUP BY products.id";
    $result = $conn->query($query);
    
    $products = [];
    while ($row = $result->fetch_assoc()) {
        if(!empty($row['category'])) {
            $categoryEnteries = explode(',', $row['category']);
            $category_details = [];
            foreach ($categoryEnteries as $entry) {
                list($id, $name) = explode('|', $entry, 2);
                $category_details[] = ['category_id' => $id, 'category_name' => $name];
            }
            $row['category'] = $category_details;
        }
        
        if ($row['weight_price'] == 0) {
            if (!empty($row['sizes'])) {
                $sizeEntries = explode(',', $row['sizes']);
                $size_details = [];
                foreach ($sizeEntries as $entry) {
                    list($id, $name, $price) = explode('|', $entry, 3);
                    $size_details[] = ['size_id' => $id,'size_name' => $name, 'price' => $price];
                }
                $row['sizes'] = $size_details;
            }
        }
        $products[] = $row;
    }
    echo json_encode($products);
}

elseif ($method === 'POST') {
    // Handle multipart form data
    $data = $_POST;
    $image = isset($_FILES['image']) ? $_FILES['image'] : null;
    
    // Check if this is actually a PUT request being spoofed
    $actualMethod = isset($_POST['_method']) ? $_POST['_method'] : 'POST';
    
    if ($actualMethod === 'PUT') {
        // This is an update operation (PUT)
        if (!isset($data['id'])) {
            echo json_encode(["error" => "Missing product ID for update"]);
            exit;
        }
        
        $product_id = $data['id'];
        
        // Get current product data to preserve existing image if no new one is uploaded
        $current_query = "SELECT image FROM products WHERE id = ?";
        $stmt = $conn->prepare($current_query);
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(["error" => "Product not found"]);
            exit;
        }
        
        $current_product = $result->fetch_assoc();
        $stmt->close();
        
        // Process image upload
        if ($image && $image['error'] == 0) {
            $upload_dir = '../../../public/img/products/';
            $image_name = basename($image['name']);
            $target_path = $upload_dir . $image_name;
            if (!move_uploaded_file($image['tmp_name'], $target_path)) {
                echo json_encode(["error" => "Failed to upload image"]);
                exit;
            }
        } else {
            // Keep existing image if no new one is uploaded
            $image_name = $current_product['image'];
        }

        // Update product data
        $name = $data['name'];
        $description = isset($data['description']) ? $data['description'] : '';
        $weight_price = isset($data['weight_price']) ? $data['weight_price'] : 0;
        $availability = isset($data['availability']) ? $data['availability'] : 1;

        // Update the product using prepared statement
        $update_query = "UPDATE products SET name = ?, image = ?, description = ?, weight_price = ?, availability = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $conn->prepare($update_query);
        $stmt->bind_param("sssiii", $name, $image_name, $description, $weight_price, $availability, $product_id);

        if (!$stmt->execute()) {
            echo json_encode(["error" => "Error updating product: " . $conn->error]);
            exit;
        }
        $stmt->close();

        // Update categories if provided
        if (isset($data['categories'])) {
            // Delete existing categories using prepared statement
            $del_cat_stmt = $conn->prepare("DELETE FROM product_category WHERE product_id = ?");
            $del_cat_stmt->bind_param("i", $product_id);
            $del_cat_stmt->execute();
            $del_cat_stmt->close();

            // Add new categories
            $categories = json_decode($data['categories'], true);
            if (is_array($categories)) {
                foreach ($categories as $category_id) {
                    $cat_stmt = $conn->prepare("INSERT INTO product_category (product_id, category_id) VALUES (?, ?)");
                    $cat_stmt->bind_param("ii", $product_id, $category_id);
                    $cat_stmt->execute();
                    $cat_stmt->close();
                }
            }
        }

        // Update sizes if provided
        if (isset($data['product_sizes'])) {
            // Delete existing sizes using prepared statement
            $del_size_stmt = $conn->prepare("DELETE FROM product_sizes WHERE product_id = ?");
            $del_size_stmt->bind_param("i", $product_id);
            $del_size_stmt->execute();
            $del_size_stmt->close();

            // Add new sizes
            $sizes = json_decode($data['product_sizes'], true);
            if (is_array($sizes)) {
                foreach ($sizes as $size) {
                    $size_id = $size['size_id'];
                    $price = $size['price'];
                    $size_stmt = $conn->prepare("INSERT INTO product_sizes (product_id, sizes_id, price) VALUES (?, ?, ?)");
                    $size_stmt->bind_param("iii", $product_id, $size_id, $price);
                    $size_stmt->execute();
                    $size_stmt->close();
                }
            }
        }

        echo json_encode(["message" => "Product updated successfully"]);
        
    } else {
        // This is a standard create operation (POST)
        $image_name = null;
        // Process image upload
        if ($image && $image['error'] == 0) {
            $upload_dir = '../../../public/img/products/';
            $image_name = basename($image['name']);
            $target_path = $upload_dir . $image_name;
            if (!move_uploaded_file($image['tmp_name'], $target_path)) {
                echo json_encode(["error" => "Failed to upload image"]);
                exit;
            }
        }

        // Insert product data using prepared statement
        $stmt = $conn->prepare("INSERT INTO products (name, image, description, weight_price, availability, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->bind_param("sssii", $data['name'], $image_name, $data['description'], $data['weight_price'], $data['availability']);
        
        if ($stmt->execute()) {
            $product_id = $stmt->insert_id;

            // Process categories
            if (isset($data['categories'])) {
                $categories = json_decode($data['categories'], true);
                foreach ($categories as $category_id) {
                    $cat_stmt = $conn->prepare("INSERT INTO product_category (product_id, category_id) VALUES (?, ?)");
                    $cat_stmt->bind_param("ii", $product_id, $category_id);
                    $cat_stmt->execute();
                    $cat_stmt->close();
                }
            }

            // Process sizes
            if (isset($data['product_sizes'])) {
                $sizes = json_decode($data['product_sizes'], true);
                foreach ($sizes as $size) {
                    $size_stmt = $conn->prepare("INSERT INTO product_sizes (product_id, sizes_id, price) VALUES (?, ?, ?)");
                    $size_stmt->bind_param("iid", $product_id, $size['size_id'], $size['price']);
                    $size_stmt->execute();
                    $size_stmt->close();
                }
            }

            echo json_encode(["message" => "Product added successfully", "id" => $product_id]);
        } else {
            echo json_encode(["error" => "Failed to add product: " . $conn->error]);
        }
        $stmt->close();
    }
}

elseif ($method === 'PUT') {
    // We're now handling PUT requests via POST with _method=PUT
    // This section remains for API completeness if you ever need direct PUT support
    echo json_encode(["error" => "Please use POST with _method=PUT for updates"]);
}

elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id'])) {
        echo json_encode(["message" => "Missing product ID"]);
        exit;
    }

    // Delete related data first
    $product_id = $data['id'];
    $conn->query("DELETE FROM product_category WHERE product_id = $product_id");
    $conn->query("DELETE FROM product_sizes WHERE product_id = $product_id");

    // Then delete the product
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();

    echo json_encode(["message" => "Product deleted successfully"]);
}

else {
    echo json_encode(["message" => "Invalid request method"]);
}
?>