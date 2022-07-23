import './index.css';
import { Player } from './components/Player';
import { Projectile } from './components/Projectile';
import { IProjectile, ProjectileProps } from './types';
import { animate } from './utils/animate';
import { Grid } from './components/Grid';

const canvas: HTMLCanvasElement | null = document.querySelector('.canvas');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const projectiles: IProjectile[] = [];

  const player = new Player({
    canvas,
    ctx,
    projectiles,
    createProjectile: (config: ProjectileProps) => new Projectile(config),
  });

  const grids = [new Grid({ ctx, canvas })];

  const animateCanvas = animate(() => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    projectiles.forEach((projectile, index) => {
      if (projectile.position.y + projectile.radius <= 0) {
        projectiles.splice(index, 1);
      } else {
        projectile.update();
      }
    });

    grids.forEach((grid) => {
      grid.update();
      grid.invaders.forEach((invader) => invader.update({ velocity: grid.velocity }));
    });
  });

  player.init();
  animateCanvas();

  console.log(grids[0]);
}
