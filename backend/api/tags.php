<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/db.php';

$stmt = $pdo->prepare("SELECT id, name FROM tags ORDER BY name ASC");
$stmt->execute();
$tags = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($tags);
?>