<!DOCTYPE html>
<html lang="hu">
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/addons/p5.sound.min.js"></script>
    <link rel="stylesheet" type="text/css" href="style.css">
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
    <script src="sketch.js"></script>
    </div>
    <div class="leaderboard-container">
    <h2 class="lb-title">LEADERBOARD</h2>
    <?php
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
        //echo "<tr><th style=\"text-align: center; \">Helyezés</th><th>Játékos</th><th>Rekord</th></tr>";

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
          <td>" . htmlspecialchars($row['score']) . "</td>
          </tr>";

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
