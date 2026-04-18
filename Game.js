const TILE_WIDTH = 80;
const TILE_HEIGHT = 40;

let player;
let ball;
let tiles;

let allTilesCount = 0;
let score = 0;
let hitTilesCount = 0;

let gameStarted = false;

let playerHitSound;
let tileHitSound;
let time;
let font;
let isTabActive = true;

const powerUpIconTexSources = {
  "enlarge": "Assets/Images/powerup_enlarge.png",
  "slowball": "Assets/Images/powerup_slowball.png",
  "fastplayer": "Assets/Images/powerup_fastplayer.png",
  "heart": "Assets/Images/powerup_heart.png"
};

let powerUpIconTextures = [];

let powerUpGlowTexture;

async function submitScore() 
{
  try 
  {
    const response = await fetch("submitscore.php", 
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: Number(score) })
    });

    if (!response.ok) throw new Error(`HTTP hiba! Státusz: ${response.status}`);
  } catch (err) {
    console.error("submitScore hiba:", err);
  }
}

function resetGame()
{
  tiles = [];
  allTilesCount = 0;
  hitTilesCount = 0;
  player = new Player();
  ball = new Ball(); 
  generateTiles();
}

function restartGame()
{
  tiles = [];
  allTilesCount = 0;
  generateTiles();
}

function saveScore()
{
  submitScore(score);
}

function circleRect(cx, cy, radius, rx, ry, rw, rh) 
{
  let testX = cx;
  let testY = cy;

  if (cx < rx)         testX = rx;     
  else if (cx > rx+rw) testX = rx+rw;   
  if (cy < ry)         testY = ry;     
  else if (cy > ry+rh) testY = ry+rh;   

  let distX = cx-testX;
  let distY = cy-testY;
  let distance = sqrt( (distX*distX) + (distY*distY) );

  if (distance <= radius) 
  {
    return true;
  }
  return false;
}

function renderTiles()
{
  if(!allTilesCount)
    return;
    
  for(i = 0; i < allTilesCount; i ++)
  {
    tiles[i].render();
  }
}

function generateTiles()
{
  let w = 10, h = 5;
  for(r = 0; r < w; r++)
  {
      for(c = 0; c < h; c++)
      {

          let tileW = TILE_WIDTH;
          let tileH = TILE_HEIGHT;
          tiles[allTilesCount] = new Tile(r * tileW + tileW * 0.5, c * tileH + tileH * 0.5);
          
      
          /*if(random() < 0.05)
          {
            tiles[allTilesCount].setPowerUpIconTexture(powerUpIconTextures["heart"]);
            tiles[allTilesCount].setPowerUpGlowTexture(powerUpGlowTexture);
          }*/
          allTilesCount++;
      }
  }
}

function checkTileCollisions()
{
  let bpX = ball.getPosX();
  let bpY = ball.getPosY();
  let r = ball.getRadius();

  for (let i = 0; i < allTilesCount; ++i)
  {
    if (!tiles[i].isActive())
      continue;

    let tx = tiles[i].getPosX();
    let ty = tiles[i].getPosY();
    let hw = tiles[i].getWidth()  / 2;
    let hh = tiles[i].getHeight() / 2;

    let closestX = Math.max(tx - hw, Math.min(bpX, tx + hw));
    let closestY = Math.max(ty - hh, Math.min(bpY, ty + hh));

    let dx = bpX - closestX;
    let dy = bpY - closestY;

    if (dx * dx + dy * dy <= r * r)
    {
      let overlapX = (hw + r) - Math.abs(bpX - tx);
      let overlapY = (hh + r) - Math.abs(bpY - ty);

      if (overlapX < overlapY)
      {
        ball.setDirection(-ball.getDirX(), ball.getDirY());

        if (bpX < tx)
          ball.setPosition(tx - hw - r, bpY);
        else
          ball.setPosition(tx + hw + r, bpY);
      }
      else
      {
        ball.setDirection(ball.getDirX(), -ball.getDirY());

        if (bpY < ty)
          ball.setPosition(bpX, ty - hh - r);
        else
          ball.setPosition(bpX, ty + hh + r);
      }

      tiles[i].deactivate();
      tileHitSound.play();
      score++;
      hitTilesCount++;

      break; 
    }
  }

  if (hitTilesCount >= allTilesCount)
  {
    resetGame();
  }
}

function checkPlayerCollision()
{
  let bpX = ball.getPosX();
  let bpY = ball.getPosY();
  let bpR = ball.getRadius();
  
  if(circleRect(bpX + ball.getRadius() / 2, bpY - ball.getRadius() / 2, bpR, player.getPosX() - player.getWidth() / 2, player.getPosY() - player.getHeight() / 2, player.getWidth(), player.getHeight()))
  {
    let distFromCenter = (bpX - player.getPosX()) / (player.getWidth() / 2);
    ball.setDirection(-ball.getDirX() + distFromCenter * 0.5, -1);
    playerHitSound.play();
  }
}

function checkWallCollisions()
{
  const bpX = ball.getPosX();
  const bpY = ball.getPosY();
  const bpR = ball.getRadius() / 2;
      
  if(bpX + bpR >= width)
  {
    ball.setDirection(-ball.getDirX(), ball.getDirY());
    ball.setPosition(width - bpR, bpY);
  }
  
  if(bpX - bpR <= 0)
  {
    ball.setDirection(abs(ball.getDirX()), ball.getDirY());
    ball.setPosition(bpR, bpY);
  }
  
  if(bpY <= 0)
  {
    ball.setDirection(ball.getDirX(), -ball.getDirY());
    ball.setPosition(bpX, bpR);
  }
  
  if(bpY >= height && gameStarted)
  {
    gameStarted = false;
    saveScore();
    score = 0;
  }
}

function centerCanvas(canvas) 
{
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

function preload()
{
  font = loadFont('Assets/Fonts/Font.ttf', 
    success => console.log("Font loaded successfully"), 
    error => console.error("Error loading font:", error));

  for (const key in powerUpIconTexSources)
  {
    powerUpIconTextures[key] = loadImage(powerUpIconTexSources[key], 
      success => console.log(`Texture for ${key} loaded successfully`), 
      error => console.error(`Error loading texture for ${key}:`, error));
  }
    

  powerUpGlowTexture = loadImage('Assets/Images/yellow_glow.png');
}

function setup() 
{
  let canvas = createCanvas(800, 600, WEBGL);

  playerHitSound = loadSound('Assets/Sounds/PlayerHit.wav');
  tileHitSound = loadSound('Assets/Sounds/TileHit.wav');

  frameRate(60);
  resetGame();
  centerCanvas(canvas);
}

window.onfocus = function () 
{ 
  isTabActive = true; 
}; 

window.onblur = function () 
{ 
  isTabActive = false; 
}; 

function draw() 
{
  background(20);

  let deltaTime = time ? (millis() - time) / 1000 : 0;
  time = millis();

  if(!isTabActive)
    return;

  if (gameStarted)
  {
    translate(-width/2,-height/2,0);
    player.render();
    renderTiles();

    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) 
    {
      if(player.getPosX() - player.getWidth() / 2 > 0)
        player.move(-1, deltaTime);
    }

    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW))
    {
      if(player.getPosX() + player.getWidth() / 2 < width)
        player.move(1, deltaTime);  
    }
    
    ball.render();
    if(ball.getPosY() - ball.getRadius() / 2 < height / 2)
      checkTileCollisions();
    
    checkPlayerCollision();
    checkWallCollisions();
  
    ball.update(deltaTime);
  
    textSize(25);
    textAlign(RIGHT, BOTTOM);
    fill(color(255, 0, 0, 255));
    text("Score: " + score, width - 10, height - 10);
  }
  else
  {
    textFont(font, 40);
    translate(-width/2, -height/2);
    fill(color(255, 255, 255, 255));
    textAlign(CENTER, CENTER);
    text('Press SPACE to START', width/2, height/2);
      
    if (keyIsDown(32)) 
    {
      resetGame();
      gameStarted = true;
    }
  }
}

