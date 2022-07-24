import { Coordinates, IProjectile, ProjectileProps } from '../index.types';

export abstract class Projectile implements IProjectile {
  protected ctx: CanvasRenderingContext2D;

  protected velocity: Coordinates = {
    x: 0,
    y: 0,
  };

  public position: Coordinates = {
    x: 0,
    y: 0,
  };

  protected constructor({ position, velocity, ctx }: ProjectileProps) {
    this.ctx = ctx;
    this.position = position;
    this.velocity = velocity;
  }

  draw = () => {};

  update = () => {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();
  };
}
