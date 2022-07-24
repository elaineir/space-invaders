export const animate = (callback: () => void) => {
  return function anim() {
    requestAnimationFrame(anim);
    callback();
  };
};
