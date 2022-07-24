import { InvadersGrid } from './components/InvadersGrid';
import { Player } from './components/Player';
import { Particle } from './components/Particle';
import { SquareProjectile } from './components/SquareProjectile';
import { GameType } from './index.types';
import { createParticles } from './utils/create-particles';
import { getRandomNumber } from './utils/get-random-number';

// TODO make class with private props
const GAME: GameType = {
  OVER: false,
  RUN: false,
  SCORE: 0,
  MIN_SPAWN_INTERVAL: 500,
  INVADER_SHOOTING_INTERVAL: 100,
};

const DIFFICULTY = {
  EASY: {
    MIN_SPAWN_INTERVAL: 500,
    INVADER_SHOOTING_INTERVAL: 200,
  },
  MEDIUM: {
    MIN_SPAWN_INTERVAL: 400,
    INVADER_SHOOTING_INTERVAL: 100,
  },
  HARD: {
    MIN_SPAWN_INTERVAL: 300,
    INVADER_SHOOTING_INTERVAL: 70,
  },
  INSANE: {
    MIN_SPAWN_INTERVAL: 200,
    INVADER_SHOOTING_INTERVAL: 30,
  },
};

export type DifficultyType = keyof typeof DIFFICULTY;

type GameArgs = {
  ctx: CanvasRenderingContext2D;
  $canvas: HTMLCanvasElement;
  player: Player;
  particles: Particle[];
  GAME: GameType;
  $scoreElement: HTMLElement;
  $endGamePopup: HTMLElement;
  $finalScoreElement: HTMLElement;
  $maxScoreElement: HTMLElement;
};

type finishGameArgs = {
  player: Player;
  $finalScoreElement: HTMLElement;
  $endGamePopup: HTMLElement;
  $maxScoreElement: HTMLElement;
};

type addScoreArgs = {
  score: number;
  $scoreElement: HTMLElement;
};

let frames = 0;
let spawnInterval = getRandomNumber(GAME.MIN_SPAWN_INTERVAL) + GAME.MIN_SPAWN_INTERVAL;
let invadersGrids: InvadersGrid[] = [];
let invaderProjectiles: SquareProjectile[] = [];

export const getGameSettings = (): GameType => GAME;

export const resetScore = ($scoreElement: HTMLElement) => {
  GAME.SCORE = 0;
  $scoreElement.textContent = '0';
};

export const setDifficulty = (difficulty: DifficultyType) => {
  GAME.MIN_SPAWN_INTERVAL = DIFFICULTY[difficulty].MIN_SPAWN_INTERVAL;
  GAME.INVADER_SHOOTING_INTERVAL = DIFFICULTY[difficulty].INVADER_SHOOTING_INTERVAL;
};

/** Stop and reset the game */
const finishGame = ({
  player,
  $endGamePopup,
  $finalScoreElement,
  $maxScoreElement,
}: finishGameArgs) => {
  GAME.OVER = true;
  player.setInactive();
  const maxScore = localStorage.getItem('maxScore') ?? '0';
  const isMaxedScore = +maxScore < GAME.SCORE;
  const currentScore = GAME.SCORE.toString();

  setTimeout(() => {
    GAME.RUN = false;
    $finalScoreElement.textContent = currentScore;
    $maxScoreElement.textContent = isMaxedScore ? currentScore : maxScore;
    if (isMaxedScore) {
      localStorage.setItem('maxScore', currentScore);
    }
    $endGamePopup.classList.add('popup_opened');

    spawnInterval = GAME.MIN_SPAWN_INTERVAL;
    invadersGrids = [];
    invaderProjectiles = [];
    player.projectiles = [];
  }, 2000);
};

/** Add score and render it in scoreElement */
const addScore = ({ score, $scoreElement }: addScoreArgs) => {
  GAME.SCORE += score;

  if ($scoreElement) {
    $scoreElement.textContent = GAME.SCORE.toString();
  }
};

/** Render game and calc all mechanics */
export const renderGame = ({
  ctx,
  $canvas,
  $scoreElement,
  $endGamePopup,
  $finalScoreElement,
  $maxScoreElement,
  player,
  particles,
  GAME,
}: GameArgs) => {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, $canvas.width, $canvas.height);
  player.update();

  // render particles
  particles.forEach((particle, index) => {
    // start repositioning
    if (particle.position.y - particle.radius >= $canvas.height) {
      particle.position.x = Math.random() * $canvas.width;
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
    if (projectile.position.y + projectile.height >= $canvas.height) {
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
        color: '#fff',
        isFades: true,
      });

      finishGame({
        player,
        $endGamePopup,
        $finalScoreElement,
        $maxScoreElement,
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
      if (frames % GAME.INVADER_SHOOTING_INTERVAL === 0 && grid.invaders.length > 0) {
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
                  grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                  grid.position.x = firstInvader.position.x;
                } else {
                  invadersGrids.splice(gridIndex, 1);
                }
                addScore({ score: 50, $scoreElement });
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
        canvas: $canvas,
        ctx,
      })
    );
    frames = 0;
    spawnInterval = getRandomNumber(GAME.MIN_SPAWN_INTERVAL) + GAME.MIN_SPAWN_INTERVAL;
  }

  frames++;
};
