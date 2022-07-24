import './index.css';
import { Player } from './components/Player';
import { Projectile } from './components/Projectile';
import { Grid } from './components/Grid';
import { IProjectile, ProjectileProps } from './index.types';
import { animate } from './utils/animate';
import { getRandomInterval } from './utils/get-random-interval';

const canvas: HTMLCanvasElement | null = document.querySelector('.canvas');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  let frames = 0;
  let spawnInterval = getRandomInterval(500);

  const projectiles: IProjectile[] = [];

  const player = new Player({
    canvas,
    ctx,
    projectiles,
    createProjectile: (config: ProjectileProps) => new Projectile(config),
  });

  const grids: Grid[] = [];

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

    if (grids.length > 0) {
      grids.forEach((grid) => {
        grid.update();
        grid.invaders.forEach((invader) => invader.update({ velocity: grid.velocity }));
      });
    }

    if (frames % spawnInterval === 0) {
      grids.push(new Grid({ canvas, ctx }));
      frames = 0;
      spawnInterval = getRandomInterval(500);
    }

    frames++;
  });

  player.init();
  animateCanvas();
}
