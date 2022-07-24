import './index.css';
import { Player } from './components/Player';
import { ProjectileProps } from './index.types';
import { animate } from './utils/animate';
import { getRandomNumber } from './utils/get-random-number';
import { CircleProjectile } from './components/CircleProjectile';
import { InvadersGrid } from './components/InvadersGrid';
import { SquareProjectile } from './components/SquareProjectile';
import { Particle } from './components/Particle';
import { createParticles } from './utils/create-particles';
import { createStars } from './utils/create-stars';

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
  const particles: Particle[] = [];

  createStars({ particles, canvas, ctx });

  const animateCanvas = animate(() => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    // render particles
    particles.forEach((particle, index) => {
      // start repositioning
      if (particle.position.y - particle.radius >= canvas.height) {
        particle.position.x = Math.random() * canvas.width;
        particle.position.y = -particle.radius;
      }

      if (particle.opacity <= 0) {
        particles.splice(index, 1);
      } else {
        particle.update();
      }
    });

    // render invader shooting
    invaderProjectiles.forEach((projectile, index) => {
      if (projectile.position.y + projectile.height >= canvas.height) {
        invaderProjectiles.splice(index, 1);
      } else {
        projectile.update();
      }

      // invader hit player collisions
      if (
        projectile.position.y + projectile.height >= player.position.y &&
        projectile.position.x + projectile.width >= player.position.x &&
        projectile.position.x <= player.position.x + player.width
      ) {
        invaderProjectiles.splice(index, 1);
        createParticles({
          particles,
          ctx,
          target: player,
          color: 'white',
          isFades: true,
        });
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

    // handle enemies movement
    if (invadersGrids.length > 0) {
      invadersGrids.forEach((grid, gridIndex) => {
        grid.update();

        // spawn projectiles
        if (frames % INVADER_SHOOTING_INTERVAL === 0 && grid.invaders.length > 0) {
          const randomIndex = getRandomNumber(grid.invaders.length);
          grid.invaders[randomIndex].shoot(invaderProjectiles);
        }

        grid.invaders.forEach((invader, invIndex) => {
          // sync invaders with grid
          invader.update({ velocity: grid.velocity });

          // player hit invader collisions
          player.projectiles.forEach((projectile, projIndex) => {
            if (
              projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
              projectile.position.x + projectile.radius >= invader.position.x &&
              projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
              projectile.position.y + projectile.radius >= invader.position.y
            ) {
              // remove invader and used projectile
              setTimeout(() => {
                const invaderFound = grid.invaders.includes(invader);
                const projectileFound = player.projectiles.includes(projectile);
                if (invaderFound && projectileFound) {
                  createParticles({
                    ctx,
                    particles,
                    target: invader,
                    isFades: true,
                  });

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
