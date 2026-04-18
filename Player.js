class Player
{ 
  constructor()
  {
    this.moveSpeed = 570;
    
    this.Width = 120;
    this.Height = 20;
    
    this.posX = width / 2;
    this.posY = height - this.Height / 2 - 5;

    this.fillColor = color(255, 253, 134);
    this.strokeColor = color(1);
  }
  
  render()
  {
    stroke(this.strokeColor);
    fill(this.fillColor);
    rectMode(CORNER);
    rect(this.posX - this.Width / 2, this.posY - this.Height / 2, this.Width, this.Height);
  }
  
  move(direction, deltaTime)
  {
    if(this.posX + this.Width / 2 == width && direction === 1 ||
       this.posX - this.Width / 2 == 0 && direction === -1)
      return;
    
    this.posX += direction * this.moveSpeed * deltaTime;
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
