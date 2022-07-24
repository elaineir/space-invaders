import './index.css';
import { Player } from './components/Player';
import { CircleProjectile } from './components/CircleProjectile';
import { Particle } from './components/Particle';
import { ProjectileProps } from './index.types';
import { getGameSettings, renderGame } from './game';
import { animate } from './utils/animate';
import { createStars } from './utils/create-stars';

const canvas: HTMLCanvasElement | null = document.querySelector('.canvas');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const GAME = getGameSettings();

  const particles: Particle[] = [];
  createStars({ particles, canvas, ctx });

  const player = new Player({
    canvas,
    ctx,
    createProjectile: (config: ProjectileProps) => new CircleProjectile(config),
  });

  const animateCanvas = animate({
    game: GAME,
    callback: () =>
      renderGame({
        ctx,
        canvas,
        GAME,
        player,
        particles,
      }),
  });

  player.init();
  animateCanvas();
}
