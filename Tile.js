
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