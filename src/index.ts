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
      grids.forEach((grid, gridIndex) => {
        grid.update();
        grid.invaders.forEach((invader, invIndex) => {
          invader.update({ velocity: grid.velocity });

          projectiles.forEach((projectile, projIndex) => {
            if (
              projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
              projectile.position.x + projectile.radius >= invader.position.x &&
              projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
              projectile.position.y + projectile.radius >= invader.position.y
            ) {
              setTimeout(() => {
                const invaderFound = grid.invaders.find((alien) => alien === invader);
                const projectileFound = projectiles.find((proj) => proj === projectile);
                if (invaderFound && projectileFound) {
                  grid.invaders.splice(invIndex, 1);
                  projectiles.splice(projIndex, 1);

                  if (grid.invaders.length > 0) {
                    const firstInvader = grid.invaders[0];
                    const lastInvader = grid.invaders[grid.invaders.length - 1];
                    grid.width =
                      lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                    grid.position.x = firstInvader.position.x;
                  } else {
                    grids.splice(gridIndex, 1);
                  }
                }
              }, 0);
            }
          });
        });
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
