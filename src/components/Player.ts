import spaceship from '../assets/images/spaceship.png';

const PLAYER_SCALE = 0.15;
const BOTTOM_OFFSET = 20;
const PLAYER_SPEED = 10;
const ROTATION_ANGLE = 0.15;

export class Player {
  private position = {
    x: 0,
    y: 0,
  };

  private velocity = {
    x: 0,
    y: 0,
  };

  private rotation = 0;

  private image: HTMLImageElement | null = null;
  private width = 0;
  private height = 0;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;

    const image = new Image();
    image.src = spaceship;
    image.onload = () => {
      this.image = image;
      this.width = image.width * PLAYER_SCALE;
      this.height = image.height * PLAYER_SCALE;
      this.position = {
        x: this.canvas.width / 2 - this.width / 2,
        y: this.canvas.height - this.height - BOTTOM_OFFSET,
      };
      this.velocity = {
        x: this.canvas.width / 2 - this.width / 2,
        y: this.canvas.height - this.height - BOTTOM_OFFSET,
      };
    };
  }

  draw = () => {
    // this.ctx.fillStyle = 'red';
    // this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    if (this.image && this.width && this.height) {
      this.ctx.save();

      this.ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
      this.ctx.rotate(this.rotation);
      this.ctx.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);

      this.ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
      this.ctx.restore();
    }
  };

  update = () => {
    this.draw();
    this.position.x = this.velocity.x;
  };

  move = ({ key }: KeyboardEvent) => {
    switch (key) {
      case 'a':
        if (this.position.x >= 0) {
          this.velocity.x += -PLAYER_SPEED;
          this.rotation = -ROTATION_ANGLE;
        }
        break;
      case 'd':
        if (this.position.x + this.width <= this.canvas.width) {
          this.velocity.x += PLAYER_SPEED;
          this.rotation = ROTATION_ANGLE;
        }
        break;
      case ' ':
        console.log('shoot!');
    }
  };

  onKeyUp = () => {
    this.rotation = 0;
  };

  init = () => {
    window.addEventListener('keydown', this.move);
    window.addEventListener('keyup', this.onKeyUp);
  };
}
