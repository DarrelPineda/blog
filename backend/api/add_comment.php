<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

session_start();
require_once '../config/db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$post_id = $data['post_id'] ?? null;
$comment_text = $data['comment_text'] ?? '';

if (!$post_id || !$comment_text) {
    http_response_code(400);
    echo json_encode(['error' => 'Post and comment required']);
    exit;
}

$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("INSERT INTO comments (post_id, user_id, comment_text) VALUES (?, ?, ?)");
$stmt->execute([$post_id, $user_id, $comment_text]);

echo json_encode(['success' => true]);
?>