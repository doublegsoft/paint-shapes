/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

import { Point } from "./Point";
import {Color} from "./Color";

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

  private _borderRadius: number = 0;

  private _foregroundColor: Color = Color.black;

  private _backgroundColor: Color = Color.transparent;

  private _borderColor: Color = Color.transparent;

  private _borderWidth: number = 2;

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
  protected constructor(points: Point[]) {
    if (points.length == 0) {
      throw new Error('A shape must have at least one point.');
    }
    this.points = [...points]; // shallow copy for safety
  }

  /**
   * Translates (moves) the shape by a vector.
   *
   * The concrete shape can choose to either mutate the existing points or
   * return a new shape instance – here we mutate in place for simplicity.
   */
  translate(nx: number, ny: number): void {
    const p= this.points[0];
    const dx= p.x - nx;
    const dy= p.y - ny;
    for (let i= 0; i < this.points.length; i++) {
      const p= this.points[i];
      p.x = p.x - dx;
      p.y = p.y - dy;
    }
  }

  /** 
   * Rotates the shape around a pivot point by a given angle (in degrees). 
   */
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

  /**
   * Gets offset relative to the top-left point according to the given point.
   */
  offset(point: Point): Point {
    const topLeft = this.points[0];
    return new Point(point.x - topLeft.x, point.y - topLeft.y);
  }

  /**
   * Checks this shape contain the given point.
   * 
   * @param point 
   *      the point
   */
  abstract contains(point: Point): boolean;

  set foregroundColor(value: Color) {
    this._foregroundColor = value;
  }

  get foregroundColor() {
    return this._foregroundColor;
  }

  set backgroundColor(value: Color) {
    this._backgroundColor = value;
  }

  get backgroundColor() {
    return this._backgroundColor;
  }

  set borderColor(value: Color) {
    this._borderColor = value;
  }

  get borderColor() {
    return this._borderColor;
  }

  set borderWidth(value: number) {
    this._borderWidth = value;
  }

  get borderWidth() {
    return this._borderWidth;
  }

  set borderRadius(value: number) {
    this._borderRadius = value;
  }

  get borderRadius() {
    return this._borderRadius;
  }

}