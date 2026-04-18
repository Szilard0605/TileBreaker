
class Tile
{ 
    constructor(posX, posY)
    { 
      this.active = true;
      
      this.Width  = TILE_WIDTH;
      this.Height = TILE_HEIGHT;

      this.halfWidth = this.Width / 2;
      this.halfHeight = this.Height / 2;
    
      this.fillColor = color(255, 135, 135, 255);
      this.strokeColor = color(0, 0, 0);
      
      this.posX = posX;
      this.posY = posY;

      this.testTexture;
      
      this.r = random(100, 255);
      this.g = random(100, 255);
      this.b = random(100, 255);

      this.powerUp = null;
      this.powerUpIconTexture = null;
      this.powerUpGlowTexture = null;
    }
  
    render()
    {  
      if(!this.active)
        return;
      
      noStroke();
      /*if(!this.powerUpIconTexture)
        fill(this.fillColor);
      else
        fill(252, 181, 118);*/

      fill(this.fillColor);
      stroke(this.strokeColor);
      rectMode(CORNER);

      rect(this.posX - this.halfWidth, this.posY - this.halfHeight, this.Width, this.Height, 0);

      /*if(this.powerUpIconTexture != null && this.powerUpGlowTexture != null)
      {
        imageMode(CENTER);
        image(this.powerUpIconTexture, this.posX, this.posY, this.Width * 0.3, this.Width * 0.3);
      
        imageMode(CENTER);
        image(this.powerUpGlowTexture, this.posX, this.posY, this.Width, this.Height);
      }*/
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

    setPowerUpIconTexture(texture)
    {
      this.powerUpIconTexture = texture;
    }

    setPowerUpGlowTexture(texture)
    {
      this.powerUpGlowTexture = texture;
    }
}