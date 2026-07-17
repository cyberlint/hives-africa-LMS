export function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(
  start: number,
  end: number,
  amount: number,
) {
  return start + (end - start) * amount;
}

const easeOut = (x: number) =>
  1 - Math.pow(1 - x, 3);

export function getSlideTransform(
  distance: number,
) {
  const abs = Math.abs(distance);

  const progress = easeOut(
    clamp(abs / 2.5, 0, 1),
  );

  return {
    scale: 1 - progress * 0.18,
    translateY: progress * 36,
    rotate: distance * 4,
    opacity: 1 - progress * 0.55,
    zIndex: Math.round(100 - abs * 10),
  };
}