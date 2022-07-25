import { Coordinates, ICircleProjectile, ProjectileProps } from '../index.types';
import spaceship from '../assets/images/spaceship.png';

const PLAYER_SCALE = 0.15;
const BOTTOM_OFFSET = 20;
const PLAYER_SPEED = 8;
const ROTATION_ANGLE = 0.15;

const KEYBOARD_CONTROLS = {
  LEFT: 'a',
  RIGHT: 'd',
  FIRE: ' ',
};

type PlayerProps = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  createProjectile: (config: ProjectileProps) => ICircleProjectile;
};

export class Player {
  private canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  private velocity: Coordinates = {
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

  private image: HTMLImageElement | null = null;
  private opacity = 1;
  private rotation = 0;

  private readonly createProjectile: (config: ProjectileProps) => ICircleProjectile;

  public position: Coordinates = {
    x: 0,
    y: 0,
  };

  public width = 0;
  public height = 0;

  public projectiles: ICircleProjectile[] = [];

  constructor({ canvas, ctx, createProjectile }: PlayerProps) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.createProjectile = createProjectile;

    const image = new Image();
    image.src = spaceship;
    image.onload = () => {
      this.image = image;
      this.width = image.width * PLAYER_SCALE;
      this.height = image.height * PLAYER_SCALE;
      this.setInitialCoordinates();
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
        this.shoot();
        break;
      default:
        this.keys[KEYBOARD_CONTROLS.LEFT].pressed = false;
        this.keys[KEYBOARD_CONTROLS.RIGHT].pressed = false;
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

  private shoot = () => {
    this.projectiles.push(
      this.createProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y,
        },
        velocity: {
          x: 0,
          y: -10,
        },
        ctx: this.ctx,
      })
    );
  };

  draw = () => {
    if (this.image && this.width && this.height) {
      this.ctx.save();
      this.ctx.globalAlpha = this.opacity;
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

  setInitialCoordinates = () => {
    const x = this.canvas.width / 2 - this.width / 2;
    const y = this.canvas.height - this.height - BOTTOM_OFFSET;
    this.position = { x, y };
    this.velocity = { x, y };
  };

  init = () => {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.opacity = 1;
  };

  setInactive = () => {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.opacity = 0;
  };
}
