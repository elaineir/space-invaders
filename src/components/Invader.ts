import { Coordinates } from '../types';
import invader from '../assets/images/invader.png';

const INVADER_SCALE = 1;

type InvaderProps = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
};

export class Invader {
  private canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  private velocity: Coordinates = {
    x: 0,
    y: 0,
  };

  private position: Coordinates = {
    x: 0,
    y: 0,
  };

  private image: HTMLImageElement | null = null;
  private width = 0;
  private height = 0;

  constructor({ canvas, ctx }: InvaderProps) {
    this.canvas = canvas;
    this.ctx = ctx;

    const image = new Image();
    image.src = invader;
    image.onload = () => {
      this.image = image;
      this.width = image.width * INVADER_SCALE;
      this.height = image.height * INVADER_SCALE;
      const x = this.canvas.width / 2 - this.width / 2;
      const y = this.canvas.height / 2;
      this.position = { x, y };
      this.velocity = { x, y };
    };
  }

  draw = () => {
    // this.ctx.fillStyle = 'red';
    // this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    if (this.image && this.width && this.height) {
      this.ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
  };

  update = () => {
    this.position.x = this.velocity.x;
    this.position.y = this.velocity.y;
    this.draw();
  };
}
