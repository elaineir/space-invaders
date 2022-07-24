import './index.css';
import { Player } from './components/Player';
import { ProjectileProps } from './index.types';
import { animate } from './utils/animate';
import { getRandomNumber } from './utils/get-random-number';
import { CircleProjectile } from './components/CircleProjectile';
import { InvadersGrid } from './components/InvadersGrid';
import { SquareProjectile } from './components/SquareProjectile';

const MIN_SPAWN_INTERVAL = 500;
const INVADER_SHOOTING_INTERVAL = 100;

const canvas: HTMLCanvasElement | null = document.querySelector('.canvas');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  let frames = 0;
  let spawnInterval = getRandomNumber(MIN_SPAWN_INTERVAL) + MIN_SPAWN_INTERVAL;

  const player = new Player({
    canvas,
    ctx,
    createProjectile: (config: ProjectileProps) => new CircleProjectile(config),
  });

  const invadersGrids: InvadersGrid[] = [];
  const invaderProjectiles: SquareProjectile[] = [];

  const animateCanvas = animate(() => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    // render invader shooting
    invaderProjectiles.forEach((projectile, index) => {
      if (projectile.position.y + projectile.height >= canvas.height) {
        invaderProjectiles.splice(index, 1);
      } else {
        projectile.update();
      }

      // player collisions
      if (
        projectile.position.y + projectile.height >= player.position.y &&
        projectile.position.x + projectile.width >= player.position.x &&
        projectile.position.x <= player.position.x + player.width
      ) {
        console.log('loser');
      }
    });

    // render player shooting
    player.projectiles.forEach((projectile, index) => {
      if (projectile.position.y + projectile.radius <= 0) {
        player.projectiles.splice(index, 1);
      } else {
        projectile.update();
      }
    });

    if (invadersGrids.length > 0) {
      invadersGrids.forEach((grid, gridIndex) => {
        grid.update();

        // spawn projectiles
        if (frames % INVADER_SHOOTING_INTERVAL === 0 && grid.invaders.length > 0) {
          const randomIndex = getRandomNumber(grid.invaders.length);
          grid.invaders[randomIndex].shoot(invaderProjectiles);
        }

        // handle player shooting and enemies movement
        grid.invaders.forEach((invader, invIndex) => {
          invader.update({ velocity: grid.velocity });

          player.projectiles.forEach((projectile, projIndex) => {
            if (
              projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
              projectile.position.x + projectile.radius >= invader.position.x &&
              projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
              projectile.position.y + projectile.radius >= invader.position.y
            ) {
              setTimeout(() => {
                const invaderFound = grid.invaders.includes(invader);
                const projectileFound = player.projectiles.includes(projectile);
                if (invaderFound && projectileFound) {
                  grid.invaders.splice(invIndex, 1);
                  player.projectiles.splice(projIndex, 1);

                  if (grid.invaders.length > 0) {
                    const firstInvader = grid.invaders[0];
                    const lastInvader = grid.invaders[grid.invaders.length - 1];
                    grid.width =
                      lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                    grid.position.x = firstInvader.position.x;
                  } else {
                    invadersGrids.splice(gridIndex, 1);
                  }
                }
              }, 0);
            }
          });
        });
      });
    }

    // spawn enemies
    if (frames % spawnInterval === 0) {
      invadersGrids.push(
        new InvadersGrid({
          canvas,
          ctx,
        })
      );
      frames = 0;
      spawnInterval = getRandomNumber(MIN_SPAWN_INTERVAL) + MIN_SPAWN_INTERVAL;
    }

    frames++;
  });

  player.init();
  animateCanvas();
}
