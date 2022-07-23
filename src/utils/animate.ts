export function animate(callback: () => void) {
  return function anim() {
    requestAnimationFrame(anim);
    callback();
  };
}
