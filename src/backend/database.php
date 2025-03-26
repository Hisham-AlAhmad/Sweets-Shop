<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "fresh_time";
$port = 3306;

$conn = new mysqli($host, $user, $pass, $dbname, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
