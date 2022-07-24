import { Coordinates, IProjectile, ProjectileProps } from '../index.types';
import spaceship from '../assets/images/spaceship.png';

const PLAYER_SCALE = 0.15;
const BOTTOM_OFFSET = 20;
const PLAYER_SPEED = 5;
const ROTATION_ANGLE = 0.15;

const KEYBOARD_CONTROLS = {
  LEFT: 'a',
  RIGHT: 'd',
  FIRE: ' ',
};

type PlayerProps = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  createProjectile: (config: ProjectileProps) => IProjectile;
  projectiles: IProjectile[];
};

export class Player {
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

  private keys = {
    [KEYBOARD_CONTROLS.LEFT]: {
      pressed: false,
    },
    [KEYBOARD_CONTROLS.RIGHT]: {
      pressed: false,
    },
  };

  private rotation = 0;

  private image: HTMLImageElement | null = null;
  private width = 0;
  private height = 0;

  private projectiles: IProjectile[];
  private readonly createProjectile: (config: ProjectileProps) => IProjectile;

  constructor({ canvas, ctx, projectiles, createProjectile }: PlayerProps) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.projectiles = projectiles;
    this.createProjectile = createProjectile;

    const image = new Image();
    image.src = spaceship;
    image.onload = () => {
      this.image = image;
      this.width = image.width * PLAYER_SCALE;
      this.height = image.height * PLAYER_SCALE;
      const x = this.canvas.width / 2 - this.width / 2;
      const y = this.canvas.height - this.height - BOTTOM_OFFSET;
      this.position = { x, y };
      this.velocity = { x, y };
    };
  }

  private onKeyDown = ({ key }: KeyboardEvent) => {
    switch (key) {
      case KEYBOARD_CONTROLS.LEFT:
        this.keys[KEYBOARD_CONTROLS.LEFT].pressed = true;
        break;
      case KEYBOARD_CONTROLS.RIGHT:
        this.keys[KEYBOARD_CONTROLS.RIGHT].pressed = true;
        break;
      case KEYBOARD_CONTROLS.FIRE:
        this.fire();
    }
  };

  private onKeyUp = ({ key }: KeyboardEvent) => {
    switch (key) {
      case KEYBOARD_CONTROLS.LEFT:
        this.keys[KEYBOARD_CONTROLS.LEFT].pressed = false;
        break;
      case KEYBOARD_CONTROLS.RIGHT:
        this.keys[KEYBOARD_CONTROLS.RIGHT].pressed = false;
    }
  };

  private move = () => {
    if (this.keys[KEYBOARD_CONTROLS.LEFT].pressed && this.position.x >= 0) {
      this.velocity.x += -PLAYER_SPEED;
      this.rotation = -ROTATION_ANGLE;
    } else if (
      this.keys[KEYBOARD_CONTROLS.RIGHT].pressed &&
      this.position.x + this.width <= this.canvas.width
    ) {
      this.velocity.x += PLAYER_SPEED;
      this.rotation = ROTATION_ANGLE;
    } else {
      this.velocity.x += 0;
      this.rotation = 0;
    }
  };

  private fire = () => {
    this.projectiles.push(
      this.createProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y,
        },
        velocity: {
          x: 0,
          y: -5,
        },
        ctx: this.ctx,
      })
    );
  };

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
    this.position.x = this.velocity.x;
    this.move();
    this.draw();
  };

  init = () => {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  };
}
