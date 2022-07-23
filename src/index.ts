import './index.css';
import { Player } from './components/Player';
import { Projectile } from './components/Projectile';
import { IProjectile, ProjectileProps } from './types';
import { animate } from './utils/animate';

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
  });

  player.init();
  animateCanvas();
}
