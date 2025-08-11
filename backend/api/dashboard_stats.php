<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

session_start();
require_once '../config/db.php';

$users = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
$posts = $pdo->query("SELECT COUNT(*) FROM posts")->fetchColumn();
$categories = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
$comments = $pdo->query("SELECT COUNT(*) FROM comments")->fetchColumn();

$username = '';
if (isset($_SESSION['user_id'])) {
    $stmt = $pdo->prepare("SELECT username FROM users WHERE id=?");
    $stmt->execute([$_SESSION['user_id']]);
    $username = $stmt->fetchColumn();
}

echo json_encode([
    'stats' => [
        'users' => (int)$users,
        'posts' => (int)$posts,
        'categories' => (int)$categories,
        'comments' => (int)$comments
    ],
    'username' => $username
]);
?>