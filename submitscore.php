<?php
  require_once "{$_SERVER['DOCUMENT_ROOT']}/samlsrc/simplesamlphp/lib/_autoload.php";
  require_once "{$_SERVER['DOCUMENT_ROOT']}/samlsrc/simplesamlphp/lib/SimpleSAML/Auth/Simple.php";
  $simpleSaml = new SimpleSAML_Auth_Simple('default-sp');
  $simpleSaml->requireAuth();
  $attr = $simpleSaml->getAttributes();

  header('Content-Type: application/json; charset=utf-8');

  if ($_SERVER['REQUEST_METHOD'] !== "POST") 
  {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed: ' . $_SERVER['REQUEST_METHOD']]);
    exit;
  }

  $json = file_get_contents('php://input');
  $data = json_decode($json, true);

  $score = $data['score'] ?? null;
  $score = is_numeric($score) ? (int)$score : null;

  $link = mysqli_init(); 
  mysqli_real_connect_caesar($link);
  $connection = $link; 

  if($connection->connect_error) {
    echo json_encode(['error' => $connection->connect_error]);
    exit;
  }

  $stmt = $connection->prepare("INSERT INTO tilebreaker_scores (name, score) VALUES (?, ?) ON DUPLICATE KEY UPDATE score = IF(score < ?, ?, score)");
  $stmt->bind_param("siii", $attr["displayName"][0], $score, $score, $score);

  if($stmt->execute()) {
    echo json_encode(['ok' => true]);
  } else {
    http_response_code(500);
    echo json_encode(['error' => $stmt->error]);
  }

  $connection->close();
?>