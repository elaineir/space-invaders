import { Coordinates } from '../index.types';
import { Particle } from '../components/Particle';
import { getRandomNumber } from './get-random-number';

const PARTICLE_DENSITY = 15;
const PARTICLE_RADIUS = 3;

type createParticlesArgs = {
  particles: Particle[];
  ctx: CanvasRenderingContext2D;
  target: {
    position: Coordinates;
    width: number;
    height: number;
  };
  color?: string;
  density?: number;
  radius?: number;
};

export const createParticles = ({
  particles,
  ctx,
  target,
  color = '#baa0de',
  density = PARTICLE_DENSITY,
  radius = PARTICLE_RADIUS,
}: createParticlesArgs) => {
  for (let i = 0; i < density; i++) {
    particles.push(
      new Particle({
        ctx,
        position: {
          x: target.position.x + target.width / 2,
          y: target.position.y + target.height / 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        color,
        radius: getRandomNumber(radius),
      })
    );
  }
};
