import './index.css';
import { Player } from './components/Player';
import { CircleProjectile } from './components/CircleProjectile';
import { Particle } from './components/Particle';
import { Nullable, ProjectileProps } from './index.types';
import { getGameSettings, DifficultyType, renderGame, resetScore, setDifficulty } from './game';
import { animate } from './utils/animate';
import { createStars } from './utils/create-stars';

const $startUpPopup: Nullable<HTMLElement> = document.querySelector('#startUpPopup');
const $endGamePopup: Nullable<HTMLElement> = document.querySelector('#endGamePopup');
const $scoreElement: Nullable<HTMLElement> = document.querySelector('#scoreCounter');
const $finalScoreElement: Nullable<HTMLElement> = document.querySelector('#finalScore');
const $maxScoreElement: Nullable<HTMLElement> = document.querySelector('#maxScore');
const $playAgainButton: Nullable<HTMLElement> = document.querySelector('#playAgain');
const $toMainScreenButton: Nullable<HTMLElement> = document.querySelector('#toMainScreen');

const $levelButtonsContainer: Nullable<HTMLElement> = document.querySelector('#levelButtons');

const $canvas: Nullable<HTMLCanvasElement> = document.querySelector('.canvas');
const ctx = $canvas?.getContext('2d');

if (
  $canvas &&
  ctx &&
  $scoreElement &&
  $endGamePopup &&
  $startUpPopup &&
  $finalScoreElement &&
  $maxScoreElement &&
  $playAgainButton &&
  $toMainScreenButton &&
  $levelButtonsContainer
) {
  $canvas.width = innerWidth;
  $canvas.height = innerHeight;

  const GAME = getGameSettings();

  function runGame() {
    resetScore($scoreElement!);
    GAME.RUN = true;
    player.init();
    animateCanvas();
  }

  function startGame(evt: Event) {
    const target = evt.target as HTMLButtonElement;
    const difficulty = (target.dataset.difficulty as DifficultyType) ?? 'EASY';
    setDifficulty(difficulty);
    $startUpPopup?.classList.remove('popup_opened');
    runGame();
  }

  function playAgain() {
    $endGamePopup?.classList.remove('popup_opened');
    runGame();
  }

  function backToMainScreen() {
    $endGamePopup?.classList.remove('popup_opened');
    $startUpPopup?.classList.add('popup_opened');
  }

  const particles: Particle[] = [];
  createStars({ particles, canvas: $canvas, ctx });

  const player = new Player({
    canvas: $canvas,
    ctx,
    createProjectile: (config: ProjectileProps) => new CircleProjectile(config),
  });

  const animateCanvas = animate({
    game: GAME,
    callback: () =>
      renderGame({
        ctx,
        $canvas,
        $scoreElement,
        $endGamePopup,
        $finalScoreElement,
        $maxScoreElement,
        GAME,
        player,
        particles,
      }),
  });

  $levelButtonsContainer.addEventListener('click', startGame);
  $playAgainButton.addEventListener('click', playAgain);
  $toMainScreenButton.addEventListener('click', backToMainScreen);
}
