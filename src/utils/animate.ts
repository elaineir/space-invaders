import { GameType } from '../index.types';

type AnimateArgs = {
  game: GameType;
  callback: () => void;
};

export const animate = ({ game, callback }: AnimateArgs) => {
  return function anim() {
    if (!game.RUN) return;

    requestAnimationFrame(anim);
    callback();
  };
};
