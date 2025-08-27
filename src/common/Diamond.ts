/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

import {Shape} from "./Shape";
import {Point} from "./Point";

/**
 * A small, pure TypeScript class that builds a diamond shape.
 *
 * Usage:
 *   const d = new Diamond().size(5).char('*').fill(' ');
 *   console.log(d.toString());
 *
 *   // or
 *   const d = Diamond.fromSize(7, 'O', '-').toString();
 */
export class Diamond extends Shape {

  private _center: Point;

  private _width: number;

  private _height: number;

  constructor(center: Point, width: number, height: number) {

    const pts: Point[] = [center];
    super(pts);

    this._center = center;
    this._width = width;
    this._height = height;
  }

  set center(center: Point) {
    this._center = center;
  }

  set width(width: number) {
    this._width = width;
  }

  set height(height: number) {
    this._height = height;
  }

  offset(point: Point): Point {
    const topLeft: Point = new Point(
      this._center.x - this._width / 2,
      this._center.y - this._height / 2);
    return new Point(point.x - topLeft.x, point.y - topLeft.y);
  }

  contains(point: Point): boolean {
    let result = this.containsForRightAngleTriangle(point,
      new Point(this._center.x - this._width / 2, this._center.y),
      new Point(this._center.x, this._center.y - this._height / 2));
    if (result) {
      return result;
    }
    result = this.containsForRightAngleTriangle(point,
      new Point(this._center.x + this._width / 2, this._center.y),
      new Point(this._center.x, this._center.y - this._height / 2));
    if (result) {
      return result;
    }
    result = this.containsForRightAngleTriangle(point,
      new Point(this._center.x - this._width / 2, this._center.y),
      new Point(this._center.x, this._center.y + this._height / 2));
    if (result) {
      return result;
    }
    result = this.containsForRightAngleTriangle(point,
      new Point(this._center.x + this._width / 2, this._center.y),
      new Point(this._center.x, this._center.y + this._height / 2));
    if (result) {
      return result;
    }
    return false;
  }

  containsForRightAngleTriangle(point: Point, horizontal: Point, vertical: Point): boolean {
    const v0 = { x: horizontal.x - this._center.x, y: horizontal.y - this._center.y }; // horizontal leg
    const v1 = { x: vertical.x - this._center.x, y: vertical.y - this._center.y }; // vertical leg
    const v2 = { x: point.x - this._center.x, y: point.y - this._center.y }; // vector to the point

    const dot00 = v0.x * v0.x + v0.y * v0.y;            // |v0|²
    const dot01 = v0.x * v1.x + v0.y * v1.y;            // v0 · v1
    const dot02 = v0.x * v2.x + v0.y * v2.y;            // v0 · v2
    const dot11 = v1.x * v1.x + v1.y * v1.y;            // |v1|²
    const dot12 = v1.x * v2.x + v1.y * v2.y;            // v1 · v2

    const denom = dot00 * dot11 - dot01 * dot01;
    if (denom === 0) return false; // degenerate triangle

    const invDenom = 1 / denom;
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return u >= 0 && v >= 0 && u + v <= 1;
  }
}
