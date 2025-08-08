<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();
require_once '../config/db.php';

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'], ['admin', 'author'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$users = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
$posts = $pdo->query("SELECT COUNT(*) FROM posts")->fetchColumn();
$categories = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
$comments = $pdo->query("SELECT COUNT(*) FROM comments")->fetchColumn();

$user_id = $_SESSION['user_id'];
$username = $pdo->query("SELECT username FROM users WHERE id = $user_id")->fetchColumn();

echo json_encode([
    'stats' => [
        'users' => $users,
        'posts' => $posts,
        'categories' => $categories,
        'comments' => $comments
    ],
    'username' => $username
]);
?>