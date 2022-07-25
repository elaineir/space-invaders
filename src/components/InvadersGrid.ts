import { Coordinates, ProjectileProps } from '../index.types';
import { Invader } from './Invader';
import { SquareProjectile } from './SquareProjectile';

const INVADER_SIZE = 30;

type GridProps = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
};

export class InvadersGrid {
  private canvas: HTMLCanvasElement;

  public position: Coordinates = {
    x: 0,
    y: 0,
  };

  public width: number;

  public velocity: Coordinates = {
    x: 3,
    y: 0,
  };

  public invaders: Invader[] = [];

  constructor({ canvas, ctx }: GridProps) {
    this.canvas = canvas;

    const columns = Math.floor(Math.random() * 10 + 5);
    const rows = Math.floor(Math.random() * 5 + 2);
    this.width = columns * INVADER_SIZE;

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            canvas,
            ctx,
            position: {
              x: x * INVADER_SIZE,
              y: y * INVADER_SIZE,
            },
            createProjectile: (config: ProjectileProps) => new SquareProjectile(config),
          })
        );
      }
    }
  }

  public update = () => {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 0;

    if (this.position.x + this.width >= this.canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = INVADER_SIZE;
    }
  };
}
