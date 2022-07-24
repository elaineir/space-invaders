import { Projectile } from './Projectile';
import { ProjectileProps } from '../index.types';

export class SquareProjectile extends Projectile {
  public width = 3;
  public height = 10;

  constructor({ ctx, position, velocity }: ProjectileProps) {
    super({ ctx, position, velocity });
  }

  draw = () => {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  };
}
