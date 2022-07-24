import { Coordinates } from '../index.types';

type ParticleProps = {
  ctx: CanvasRenderingContext2D;
  position: Coordinates;
  velocity: Coordinates;
  radius: number;
  color: string;
  isFades?: boolean;
};

export class Particle {
  private ctx: CanvasRenderingContext2D;

  private velocity: Coordinates = {
    x: 0,
    y: 0,
  };

  private isFades: boolean;

  public position: Coordinates = {
    x: 0,
    y: 0,
  };

  public radius: number;
  public color: string;
  public opacity = 1;

  constructor({ position, velocity, ctx, radius, color, isFades }: ParticleProps) {
    this.ctx = ctx;
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.isFades = isFades ?? false;
  }

  draw = () => {
    this.ctx.save();
    this.ctx.globalAlpha = this.opacity;
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  };

  update = () => {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.isFades) {
      this.opacity -= 0.01;
    }
  };
}
