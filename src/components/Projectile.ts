import { Coordinates, IProjectile, ProjectileProps } from '../types';

export class Projectile implements IProjectile {
  private ctx: CanvasRenderingContext2D;

  private velocity: Coordinates = {
    x: 0,
    y: 0,
  };

  public position: Coordinates = {
    x: 0,
    y: 0,
  };

  public radius = 3;

  constructor({ position, velocity, ctx }: ProjectileProps) {
    this.ctx = ctx;
    this.position = position;
    this.velocity = velocity;
  }

  draw = () => {
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
    this.ctx.closePath();
  };

  update = () => {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();
  };
}
