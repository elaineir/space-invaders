import { Projectile } from './Projectile';
import { ProjectileProps } from '../index.types';

export class CircleProjectile extends Projectile {
  public radius = 4;

  constructor({ ctx, position, velocity }: ProjectileProps) {
    super({ ctx, position, velocity });
  }

  draw = () => {
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
    this.ctx.closePath();
  };
}
