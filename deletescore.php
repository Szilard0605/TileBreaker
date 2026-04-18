<?php
  header('Content-Type: application/json; charset=utf-8');

  if ($_SERVER['REQUEST_METHOD'] !== "POST") 
  {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed: ' . $_SERVER['REQUEST_METHOD']]);
    exit;
  }

  $link = mysqli_init(); 
  mysqli_real_connect_caesar($link);
  $connection = $link; 
  if($connection->connect_error) {
    echo json_encode(['error' => $connection->connect_error]);
    exit;
  }

  $name = $_GET['name'] ?? null;


  $stmt = $connection->prepare("DELETE FROM tilebreaker_scores WHERE name = ?");
  $stmt->bind_param("s", $name);
  if($stmt->execute()) {
    echo json_encode(['ok' => true]);
  } else {
    http_response_code(500);
    echo json_encode(['error' => $stmt->error]);
  }
  $connection->close();
?>