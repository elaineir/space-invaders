import { Particle } from '../components/Particle';
import { getRandomNumber } from './get-random-number';

const STARTS_DENSITY = 100;
const STAR_RADIUS = 3;

type createParticlesArgs = {
  particles: Particle[];
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
};

export const createStars = ({ particles, ctx, canvas }: createParticlesArgs) => {
  for (let i = 0; i < STARTS_DENSITY; i++) {
    particles.push(
      new Particle({
        ctx,
        position: {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        },
        velocity: {
          x: 0,
          y: 0.3,
        },
        color: 'white',
        radius: getRandomNumber(STAR_RADIUS),
      })
    );
  }
};
