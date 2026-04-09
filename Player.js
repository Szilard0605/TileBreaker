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
