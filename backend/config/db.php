<?php
$host = 'localhost';
$db   = 'blog_cms';      // Change this to your actual database name if different
$user = 'root';          // Default XAMPP user
$pass = '';              // Default XAMPP password is empty

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // For API: return JSON error
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => 'DB Connection failed: ' . $e->getMessage()]);
    exit;
}
?>