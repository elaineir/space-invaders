import './index.css';
import { Player } from './components/Player';

const canvas: HTMLCanvasElement | null = document.querySelector('.canvas');

if (canvas) {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const animateBackground = animate(() => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    const player = new Player(canvas, ctx);
    const animatePlayer = animate(player.draw);

    animateBackground();
    animatePlayer();
  }
}

function animate(callback: () => void) {
  return function anim() {
    requestAnimationFrame(anim);
    callback();
  };
}
