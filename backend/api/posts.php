<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

session_start();
require_once '../config/db.php';

$where = "WHERE posts.status = 'published'";
if (isset($_SESSION['user_id']) && in_array($_SESSION['role'], ['admin', 'author'])) {
    $where = ""; // Show all posts
}

$stmt = $pdo->prepare("
    SELECT posts.id, posts.title, posts.content, posts.created_at, posts.status, users.username AS author, categories.name AS category
    FROM posts
    LEFT JOIN users ON posts.author_id = users.id
    LEFT JOIN categories ON posts.category_id = categories.id
    $where
    ORDER BY posts.created_at DESC
");
$stmt->execute();
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($posts);
?>