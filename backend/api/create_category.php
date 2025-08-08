<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();
require_once '../config/db.php';

// Only allow admin or author
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'], ['admin', 'author'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$description = $data['description'] ?? '';

if (!$name) {
    http_response_code(400);
    echo json_encode(['error' => 'Category name required']);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO categories (name, description) VALUES (?, ?)");
try {
    $stmt->execute([$name, $description]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(400);
    echo json_encode(['error' => 'Category already exists or DB error']);
}
?>