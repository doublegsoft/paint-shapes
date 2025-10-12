/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

/**
 * A plain‑old JavaScript object that represents a point in 2-D or 3‑D space.
 *
 * @example
 *   const p = new Point(1.0, 2.0, 3.0);
 *   console.log(p.distanceTo(new Point(4, 6, 8))); // 7.3484692283495345
 */
export class Point {
  /** X coordinate */
  public x: number;

  /** Y coordinate */
  public y: number;

  /** Z coordinate */
  public z?: number = 0;

  /**
   * Constructs a new Point.
   * @param x - The X coordinate.
   * @param y - The Y coordinate.
   * @param z - The Z coordinate.
   */
  constructor(x: number, y: number, z?: number) {
    this.x = x;
    this.y = y;
    if (typeof z !== 'undefined') {
      this.z = z;
    } else {
      this.z = 0;
    }
  }

  public toString(): string {
    if (typeof this.z === 'undefined') {
      return `Point(${this.x}, ${this.y})`;
    } else { 
      return `Point(${this.x}, ${this.y}, ${this.z})`;
    }
  }


  /**
   * Euclidean distance to another point.
   * @param other - The other point.
   * @returns The distance.
   */
  public distanceTo(other: Point): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    if (typeof this.z === 'undefined') {
      return Math.sqrt(dx * dx + dy * dy);
    } else {
      const dz = this.z - other.z!;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
  }

  public equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }

}