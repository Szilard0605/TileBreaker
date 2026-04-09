
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
