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

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Post ID required']);
    exit;
}

// Delete all comments for this post
$stmt = $pdo->prepare("DELETE FROM comments WHERE post_id=?");
$stmt->execute([$id]);

// Delete all post_tags for this post
$stmt = $pdo->prepare("DELETE FROM post_tags WHERE post_id=?");
$stmt->execute([$id]);

// Now delete the post itself
$stmt = $pdo->prepare("DELETE FROM posts WHERE id=?");
$stmt->execute([$id]);

echo json_encode(['success' => true]);
?>