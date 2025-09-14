/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

/**
 * TODO: ADD DESCRIPTION
 */
export class Offset {
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

}