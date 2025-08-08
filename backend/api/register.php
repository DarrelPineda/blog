<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'reader'; // NEW

if (!$username || !$email || !$password || !$role) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields required']);
    exit;
}

// Only allow valid roles
$valid_roles = ['admin', 'author', 'reader'];
if (!in_array($role, $valid_roles)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid role']);
    exit;
}

$password_hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)");
try {
    $stmt->execute([$username, $email, $password_hash, $role]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(400);
    echo json_encode(['error' => 'User already exists or DB error']);
}
?>