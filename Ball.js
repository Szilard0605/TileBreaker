
class Ball
{
    constructor()
    {
      this.speed = 420;
      this.radius = 20;
      this.reset();
    }
  
    render()
    {
      stroke(1);
      fill(color(255));
      rectMode(CENTER);
      circle(this.posX, this.posY, this.radius);
    }
  
    update(deltaTime)
    {
      this.posX += this.dirX * this.speed * deltaTime;
      this.posY += this.dirY * this.speed * deltaTime;
    }
  
    reset()
    {
      this.posX = width / 2;
      this.posY = height - this.radius * 2;
      this.dirX = 0;
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
