<!DOCTYPE html>
<html lang="hu">
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/addons/p5.sound.min.js"></script>
    <link rel="stylesheet" type="text/css" href="style.css">
    <link rel="icon" type="image/x-icon" href="Assets/Images/favicon-16x16.png">
    <title>TileBreaker</title>
    <meta charset="utf-8" />

  </head>
  <body>
    <nav>
      <ul>
          <li><a href="../../index.php">Főoldal</a></li>
          <li><a href="../../Tools/Tools.html">Szoftver</a></li>
          <li><a href="../Games.html">Játékok</a></li>
      </ul>
  </nav>
  <img src="Assets/Images/logo.png" alt="TileBreaker Logo" class="logo"/>
  <div class="main-container">
    <div class="game-container">
    <script src="Ball.js"></script>
    <script src="Player.js"></script>
    <script src="Tile.js"></script>
    <script src="Game.js"></script>
    </div>
    <div class="leaderboard-container">
    <h2 class="lb-title">LEADERBOARD</h2>
    <?php
      require_once "{$_SERVER['DOCUMENT_ROOT']}/samlsrc/simplesamlphp/lib/_autoload.php";
      require_once "{$_SERVER['DOCUMENT_ROOT']}/samlsrc/simplesamlphp/lib/SimpleSAML/Auth/Simple.php";
      $simpleSaml = new SimpleSAML_Auth_Simple('default-sp');
      $simpleSaml->requireAuth();
      $attr = $simpleSaml->getAttributes();

      $link = mysqli_init(); 
      mysqli_real_connect_caesar($link);
      $connection = $link;

      if($connection->connect_error) {
        echo json_encode(['error' => $connection->connect_error]);
        exit;
      }

      $query = "SELECT name, score FROM tilebreaker_scores ORDER BY score DESC";
      $result = $connection->query($query);

      if ($result) 
      {
        echo "<table>";

        $i = 1;
        while ($row = $result->fetch_assoc()) 
        {
          $class = "";
          $emoji = "";

          if ($i == 1)
          { 
            $emoji = "🏆";
            $class = "gold";
          }
          elseif ($i == 2) $class = "silver";
          elseif ($i == 3) $class = "bronze";
          
        

          echo "<tr class='$class'>
          <td>$i.</td>
          <td>" . htmlspecialchars($row['name']) . $emoji . "</td>
          <td>" . htmlspecialchars($row['score']) . "</td>";
          
          if($attr["username"][0] == "kataisz")
          {
            // ask if im sure i want to delete the score
            echo "<td><a class='delete-link' onclick='deleteScore(\"" . urlencode($row['name']) . "\")'>❌</a></td>";

            echo "<script>
              function deleteScore(name) 
              {
                if(confirm(\"Are you sure you want to delete the score for \" + decodeURIComponent(name) + \"?\")) 
                {
                  fetch(\"deletescore.php?name=\" + name, 
                  {
                    method: \"POST\"
                  })
                  .then(response => response.json())
                  .then(data => 
                  {
                    if(data.ok) 
                    {
                      alert(\"Score deleted successfully for \" + decodeURIComponent(name));
                      location.reload();
                    } 
                    else 
                    {
                      alert(\"Error deleting score: \" + data.error);
                    }
                  })
                  .catch(error => 
                  {
                    alert(\"Error deleting score: \" + error);
                  });
                }
              }";
              echo "</script>";
          }
          echo "</tr>";


          $i++;
        }

        echo "</table>";
      } 
      else 
      {
        echo "Error while loading the leaderboard: " . $connection->error;
      }
    
    ?>
    </div>
  </div>
  </body>
</html>
