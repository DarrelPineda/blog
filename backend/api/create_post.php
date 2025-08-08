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

// Only allow logged-in users with admin or author role
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'], ['admin', 'author'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Get JSON data from frontend
$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'] ?? '';
$content = $data['content'] ?? '';
$category_id = $data['category_id'] ?? null;
$status = $data['status'] ?? 'draft';
$tags = $data['tags'] ?? []; // Array of tag IDs

if (!$title || !$content) {
    http_response_code(400);
    echo json_encode(['error' => 'Title and content are required']);
    exit;
}

$author_id = $_SESSION['user_id'];

// Insert the post
$stmt = $pdo->prepare("INSERT INTO posts (title, content, author_id, category_id, status) VALUES (?, ?, ?, ?, ?)");
$stmt->execute([$title, $content, $author_id, $category_id, $status]);
$post_id = $pdo->lastInsertId();

// Insert tags into post_tags table
if (!empty($tags) && is_array($tags)) {
    $stmtTag = $pdo->prepare("INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)");
    foreach ($tags as $tag_id) {
        // Make sure tag_id is an integer
        $tag_id = intval($tag_id);
        $stmtTag->execute([$post_id, $tag_id]);
    }
}

echo json_encode(['success' => true]);
?>