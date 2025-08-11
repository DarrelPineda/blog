<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once '../config/db.php';

$post_id = $_GET['post_id'] ?? null;
if (!$post_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Post ID required']);
    exit;
}

$stmt = $pdo->prepare("
    SELECT comments.id, comments.comment_text, comments.created_at, users.username
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = ?
    ORDER BY comments.created_at ASC
");
$stmt->execute([$post_id]);
$comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($comments);
?>