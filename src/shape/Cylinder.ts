/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/
import {Shape} from "./Shape";
import {Point} from "@/common/Point";

/**
 * A 3-D cylinder: a rectangular body capped with an elliptical top and a
 * downward-curving bottom (the classic "database" drum).
 *
 * Like {@link Circle}, the cylinder is anchored by its center point, so the
 * `x`/`y` used to position it refer to the center rather than a corner.
 *
 * @example
 * const cyl = new Cylinder(new Point(100, 100), 120, 60);
 */
export class Cylinder extends Shape {

  private _center: Point;

  private _width: number;

  private _height: number;

  constructor(center: Point, width: number, height: number) {
    if (width <= 0 || height <= 0) {
      throw new Error('Width and height must be greater than 0.');
    }
    super([center]);

    this._center = center;
    this._width = width;
    this._height = height;
  }

  get center(): Point {
    return this._center;
  }

  set center(point: Point) {
    this._center = point;
    this._points[0] = point;
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
  }

  /** Vertical radius of the elliptical caps. */
  get capRadius(): number {
    return Math.min(this._width * 0.18, this._height * 0.28);
  }

  place(point: Point): void {
    this.center = point;
  }

  offset(point: Point): Point {
    return new Point(point.x - this._center.x, point.y - this._center.y);
  }

  contains(point: Point): boolean {
    const cx = this._center.x;
    const cy = this._center.y;
    const left = cx - this._width / 2;
    const right = cx + this._width / 2;
    const top = cy - this._height / 2;
    const bottom = cy + this._height / 2;

    if (point.x < left || point.x > right || point.y < top || point.y > bottom) {
      return false;
    }

    const rx = this._width / 2;
    const ry = this.capRadius;

    // Straight body between the two caps.
    if (point.y >= top + ry && point.y <= bottom - ry) {
      return true;
    }

    // Elliptical top / bottom caps.
    const capY = point.y < cy ? top + ry : bottom - ry;
    const nx = (point.x - cx) / rx;
    const ny = (point.y - capY) / ry;
    return nx * nx + ny * ny <= 1;
  }

  getConnectablePoints(): Point[] {
    const ret = new Array<Point>();
    const c = this._center;
    ret.push(new Point(c.x, c.y - this._height / 2));   // top-middle
    ret.push(new Point(c.x + this._width / 2, c.y));     // right-middle
    ret.push(new Point(c.x, c.y + this._height / 2));    // bottom-middle
    ret.push(new Point(c.x - this._width / 2, c.y));     // left-middle
    return ret;
  }
}
