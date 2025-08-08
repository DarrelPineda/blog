<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

session_start();
require_once '../config/db.php';

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'], ['admin', 'author'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$title = $data['title'] ?? '';
$content = $data['content'] ?? '';
$category_id = $data['category_id'] ?? null;
$status = $data['status'] ?? 'draft';

if (!$id || !$title || !$content) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields required']);
    exit;
}

$stmt = $pdo->prepare("UPDATE posts SET title=?, content=?, category_id=?, status=? WHERE id=?");
$stmt->execute([$title, $content, $category_id, $status, $id]);

echo json_encode(['success' => true]);
?>