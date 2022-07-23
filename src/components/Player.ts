import spaceship from '../assets/images/spaceship.png';

const PLAYER_SCALE = 0.15;
const BOTTOM_OFFSET = 20;

export class Player {
  position = {
    x: 0,
    y: 0,
  };

  velocity = {
    x: 0,
    y: 0,
  };

  image: HTMLImageElement | null = null;
  width = 0;
  height = 0;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

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
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - BOTTOM_OFFSET,
      };
    };
  }

  draw = () => {
    // this.ctx.fillStyle = 'red';
    // this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    if (this.image && this.width && this.height) {
      this.ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
  };
}
