let TILE_WIDTH = 80;
let TILE_HEIGHT = 40;

class Player
{ 
  constructor()
  {
    this.moveSpeed = 6.3;
    
    this.Width = 120;
    this.Height = 20;
    
    this.posX = width / 2;
    this.posY = height - this.Height / 2 - 5;
  }
  
  render()
  {
    stroke(1);
    fill(color(255, 253, 134));
    rectMode(CORNER);
    rect(this.posX - this.Width / 2, this.posY - this.Height / 2, this.Width, this.Height);
  }
  
  move(direction)
  {
    if(this.posX + this.Width / 2 == width && direction === 1 ||
       this.posX - this.Width / 2 == 0 && direction === -1)
      return;
    
    this.posX += direction * this.moveSpeed;
  }
  
  getWidth()
  {
    return this.Width;
  }
  
  getHeight()
  {
    return this.Height;
  }
  
  getPosX()
  {
    return this.posX;
  }
  
  getPosY()
  {
    return this.posY;
  }
}

class Tile
{ 
    constructor(posX, posY)
    { 
      this.active = true;
      
      this.Width  = TILE_WIDTH;
      this.Height = TILE_HEIGHT;   
      
      this.posX = posX;
      this.posY = posY;
      
      this.r = random(100, 255);
      this.g = random(100, 255);
      this.b = random(100, 255);
    }
  
    render()
    {  
      if(!this.active)
        return;
      
      noStroke();
      fill(color(255, 135, 135, 255));
      //fill(color(135, 255, 189, 255));
      stroke(color(0, 0, 0));
      rectMode(CORNER);
      rect(this.posX - this.Width / 2, this.posY - this.Height / 2, this.Width, this.Height, 0); 
    }
  
    getWidth()
    {
      return this.Width;
    }
  
    getHeight()
    {
      return this.Height;
    }
  
    getPosX()
    {
      return this.posX;
    }
  
    getPosY()
    {
      return this.posY;
    }
  
    isActive()
    {
      return this.active;
    }
  
    deactivate()
    {
      this.active = false;
    }
}

class Ball
{
    constructor()
    {
      this.speed = 6.0;
      this.radius = 20;
      this.reset();
    }
  
    render()
    {
      stroke(1);
      fill(color(255));
      circle(this.posX, this.posY, this.radius);
    }
  
    update()
    {
      this.posX += this.dirX * this.speed;
      this.posY += this.dirY * this.speed;
    }
  
    reset()
    {
      this.posX = width / 2;
      this.posY = height - this.radius * 2;
      this.dirX = random(0, 1);
      this.dirY = -1;
    }

    getPosX()
    {
      return this.posX;
    }
  
    setPosition(posX, posY)
    {
      this.posX = posX;
      this.posY = posY;
    }
  
    getPosY()
    {
      return this.posY;
    }
  
    getRadius()
    {
      return this.radius;
    }
  
    getDirX()
    {
      return this.dirX;
    }
  
    getDirY()
    {
      return this.dirY;
    }
  
    setDirection(dirX, dirY)
    {
      this.dirX = dirX;
      this.dirY = dirY;
    }
}

let player;
let tiles;
let allTilesCount = 0;
let ball;
let score = 0;
let nameField;
let gameStarted = false;
let playerHitSound;
let tileHitSound;
let hitTilesCount = 0;

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
          allTilesCount++;
      }
  }
}

function checkTileCollisions()
{
  let numColTiles = 0;
  let colTileIndices = []; 
  
  for(i = 0; i < allTilesCount; ++i)
  {
      if(!tiles[i].isActive())
        continue;
        
      let bpX = ball.getPosX();
      let bpY = ball.getPosY();
      let bpR = ball.getRadius() / 2;
      let tpX = tiles[i].getPosX() - tiles[i].getWidth() / 2;
      let tpY = tiles[i].getPosY() - tiles[i].getHeight() / 2;
      let tpW = tiles[i].getWidth();
      let tpH = tiles[i].getHeight();
    
      if(circleRect(bpX + ball.getRadius() / 2, bpY - ball.getRadius() / 2, bpR, tpX, tpY, tpW, tpH))
      {
        colTileIndices[numColTiles] = i;
        numColTiles ++;
        hitTilesCount ++;
      }
  }
  
  if(numColTiles > 0)
  {
    ball.setDirection(ball.getDirX(), 1);
    for(i = 0; i < numColTiles; i++)
    {
        tiles[colTileIndices[i]].deactivate();
        tileHitSound.play();
        score ++;
    }
  }

  if(hitTilesCount >= allTilesCount)
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
    let randomMagic = random(-0.5, 0.5);
    ball.setDirection(-ball.getDirX() + randomMagic, -1);
    playerHitSound.play();
  }
}

function checkWallCollisions()
{
  let bpX = ball.getPosX();
  let bpY = ball.getPosY();
  let bpR = ball.getRadius() / 2;

      
  if(bpX + bpR / 2 >= width)
  {
    ball.setDirection(-ball.getDirX(), ball.getDirY());
  }
  
  if(bpX - bpR / 2 <= 0)
  {
    ball.setDirection(abs(ball.getDirX()), ball.getDirY());
  }
  
  if(bpY <= 0)
  {
    ball.setDirection(ball.getDirX(), -ball.getDirY());
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

function setup() 
{
  let canvas = createCanvas(800, 600);
 
  playerHitSound = loadSound('PlayerHit.wav');
  tileHitSound = loadSound('TileHit.wav');

  resetGame();
  centerCanvas(canvas);
}


function windowResized()
{
  positionInput();
}


function draw() 
{
  background(20);

  if (gameStarted)
  {
    player.render();
    renderTiles();
    
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) 
    {
      if(player.getPosX() - player.getWidth() / 2 > 0)
        player.move(-1);
    }

    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW))
    {
      if(player.getPosX() + player.getWidth() / 2 < width)
        player.move(1);  
    }
    
    ball.render();
    checkTileCollisions();
    checkPlayerCollision();
    checkWallCollisions();
  
    ball.update(); 
    
    textSize(20);
    textAlign(RIGHT);
    fill(color(255, 0, 0, 255));
    text("Score: " + score, width - 10, height - 10);
  }
  else
  {
    textSize(40);
    textAlign(CENTER);
    fill(color(255, 255, 255, 255));
    text("Press SPACE to START", width / 2, height / 2 + 20);
      
    if (keyIsDown(32)) 
    {
      gameStarted = true;
      resetGame();
    }
  }
}

