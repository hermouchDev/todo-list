<?php
require_once __DIR__ . '/api/config/db.php';

$conn = getDBConnection();

// Handle POST actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];
    $id = isset($_POST['id']) ? (int)$_POST['id'] : null;
    
    switch ($action) {
        case 'new':
            if (!empty($_POST['title'])) {
                $title = $conn->real_escape_string(trim($_POST['title']));
                $sql = "INSERT INTO todo (title) VALUES ('$title')";
                $conn->query($sql);
            }
            break;
            
        case 'delete':
            if ($id !== null) {
                $sql = "DELETE FROM todo WHERE id = $id";
                $conn->query($sql);
            }
            break;
            
        case 'toggle':
            if ($id !== null) {
                $sql = "UPDATE todo SET done = 1 - done WHERE id = $id";
                $conn->query($sql);
            }
            break;
            
        case 'update':
        if ($id !== null && !empty($_POST['title'])) {
            $title = $conn->real_escape_string(trim($_POST['title']));
            $sql = "UPDATE todo SET title = '$title' WHERE id = $id";
            $conn->query($sql);
            }
        break;
    }
}

// Read all tasks and store in $taches (sorted by created_at DESC)
$taches = [];
$sql = "SELECT id, title, done, created_at FROM todo ORDER BY created_at DESC";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $taches[] = [
            'id' => (int)$row['id'],
            'title' => $row['title'],
            'done' => (bool)$row['done'],
            'created_at' => $row['created_at']
        ];
    }
}

$conn->close();

// Return JSON for React fetch requests
header('Content-Type: application/json');
echo json_encode(['success' => true, 'data' => $taches]);
?>