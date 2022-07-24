import { Coordinates, ISquareProjectile, ProjectileProps } from '../index.types';
import invader from '../assets/images/invader.png';

const INVADER_SCALE = 1;

type InvaderProps = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  position: Coordinates;
  createProjectile: (config: ProjectileProps) => ISquareProjectile;
};

export class Invader {
  private readonly ctx: CanvasRenderingContext2D;

  private image: HTMLImageElement | null = null;

  private readonly createProjectile: (config: ProjectileProps) => ISquareProjectile;

  public width = 0;
  public height = 0;

  public position: Coordinates = {
    x: 0,
    y: 0,
  };

  constructor({ ctx, position, createProjectile }: InvaderProps) {
    this.ctx = ctx;
    this.createProjectile = createProjectile;

    const image = new Image();
    image.src = invader;
    image.onload = () => {
      this.image = image;
      this.width = image.width * INVADER_SCALE;
      this.height = image.height * INVADER_SCALE;
      this.position = { x: position.x, y: position.y };
    };
  }

  shoot = (projectiles: ISquareProjectile[]) => {
    projectiles.push(
      this.createProjectile({
        ctx: this.ctx,
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 5,
        },
      })
    );
  };

  draw = () => {
    if (this.image && this.width && this.height) {
      this.ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
  };

  update = ({ velocity }: { velocity: Coordinates }) => {
    this.position.x += velocity.x;
    this.position.y += velocity.y;
    this.draw();
  };
}
