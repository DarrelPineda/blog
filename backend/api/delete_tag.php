<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

session_start();
require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Tag ID required']);
    exit;
}

// First, delete from post_tags
$stmt = $pdo->prepare("DELETE FROM post_tags WHERE tag_id=?");
$stmt->execute([$id]);

// Then, delete from tags
$stmt = $pdo->prepare("DELETE FROM tags WHERE id=?");
$stmt->execute([$id]);

echo json_encode(['success' => true]);
?>