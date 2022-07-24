export type Coordinates = {
  x: number;
  y: number;
};

export interface IProjectile {
  position: Coordinates;
  radius: number;
  draw: () => void;
  update: () => void;
}

export type ProjectileProps = {
  ctx: CanvasRenderingContext2D;
  position: Coordinates;
  velocity: Coordinates;
};
