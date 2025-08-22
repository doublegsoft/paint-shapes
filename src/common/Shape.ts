/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

import { Point } from "./Point";

/**
 * Common contract for all geometric shapes.
 *
 * A shape:
 *  • has a list of vertices (`points`);
 *  • can report its area and perimeter (abstract);
 *  • may be moved or rotated (concrete helpers);
 *  • can be visualised by a `draw` method that must be implemented by each subclass.
 *
 * The class is marked `abstract` so it can’t be instantiated directly.
 */
export abstract class Shape {
  /**
   * Ordered list of points that define the shape’s outline.
   *
   * The array is *immutable* (readonly) to prevent accidental mutation
   * outside the class.  Sub‑classes can add helper methods that expose a
   * mutable view if they need to.
   */
  protected readonly points: ReadonlyArray<Point>;

  /**
   * @param points List of vertices that define the shape.
   *               Must contain at least two points (otherwise the shape is degenerate).
   */
  constructor(points: Point[]) {
    if (points.length < 2) {
      throw new Error('A shape must have at least two points.');
    }
    this.points = [...points]; // shallow copy for safety
  }

  /** @returns the number of vertices */
  get vertexCount(): number {
    return this.points.length;
  }

  /** @returns a shallow copy of the points array */
  getVertices(): Point[] {
    return [...this.points];
  }

  /** @returns the bounding box of the shape */
  get boundingBox(): { min: Point; max: Point } {
    const xs = this.points.map(p => p.x);
    const ys = this.points.map(p => p.y);
    return {
      min: new Point(Math.min(...xs), Math.min(...ys)),
      max: new Point(Math.max(...xs), Math.max(...ys)),
    };
  }

  /**
   * Translate (move) the shape by a vector.
   *
   * The concrete shape can choose to either mutate the existing points or
   * return a new shape instance – here we mutate in place for simplicity.
   */
  translate(nx: number, ny: number): void {
    const p = this.points[0];
    const dx = p.x - nx;
    const dy = p.y - ny;
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      p.x = p.x - dx;
      p.y = p.y - dy;
    }
  }

  /** Rotate the shape around a pivot point by a given angle (in degrees). */
  rotate(angleDeg: number, pivot: Point = new Point(0, 0)): void {
    const rad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      const x = p.x - pivot.x;
      const y = p.y - pivot.y;
      const nx = x * cos - y * sin + pivot.x;
      const ny = x * sin + y * cos + pivot.y;
      p.x = nx;
      p.y = ny;
    }
  }

}