export type Coordinates = {
  x: number;
  y: number;
};

export interface IProjectile {
  position: Coordinates;
  draw: () => void;
  update: () => void;
}

export interface ICircleProjectile extends IProjectile {
  radius: number;
}

export interface ISquareProjectile extends IProjectile {
  width: number;
  height: number;
}

export type ProjectileProps = {
  ctx: CanvasRenderingContext2D;
  position: Coordinates;
  velocity: Coordinates;
};
