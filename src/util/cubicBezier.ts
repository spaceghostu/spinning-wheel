/**
 * Calculates the y-coordinate of a cubic Bezier curve at a given parameter t.
 *
 * A cubic Bezier curve is defined by four points: P0, P1, P2, and P3.
 * This function simplifies the calculation by assuming P0 is (0, 0) and P3 is (1, 1),
 * and only takes the y-coordinates of the control points P1 and P2.
 *
 * @param t - The parameter along the curve, ranging from 0 to 1.
 * @param param1 - An array containing the y-coordinates of the control points [y1, y2].
 * @returns The y-coordinate of the cubic Bezier curve at the given parameter t.
 */
export function cubicBezierY(t: number, [y1, y2]: [number, number]): number {
  const u = 1 - t;
  return 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3;
}
