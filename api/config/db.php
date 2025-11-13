<?php
function getDBConnection() {
    $host = 'localhost';
    $user = 'root';  // Change to your MySQL username
    $pass = '';      // Change to your MySQL password
    $db = 'todolist';
    
    $conn = new mysqli($host, $user, $pass, $db);
    
    if ($conn->connect_error) {
        die(json_encode([
            'success' => false,
            'message' => 'Connection failed: ' . $conn->connect_error
        ]));
    }
    
    $conn->set_charset("utf8mb4");
    return $conn;
}
?>
