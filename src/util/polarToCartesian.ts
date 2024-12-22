export function polarToCartesian(
  angleDegrees: number,
  radius: number,
): { x: number; y: number } {
  const angleRadians = (angleDegrees - 90) * (Math.PI / 180);
  return {
    x: radius * Math.cos(angleRadians),
    y: radius * Math.sin(angleRadians),
  };
}
