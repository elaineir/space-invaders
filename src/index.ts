import './index.css';
import { Player } from './components/Player';

const canvas: HTMLCanvasElement | null = document.querySelector('.canvas');

if (canvas) {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const player = new Player(canvas, ctx);
    player.init();

    const animateCanvas = animate(() => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      player.update();
    });

    animateCanvas();
  }
}

function animate(callback: () => void) {
  return function anim() {
    requestAnimationFrame(anim);
    callback();
  };
}
