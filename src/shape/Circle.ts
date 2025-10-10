/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/
import {Point} from "@/common/Point";
import {Shape} from "./Shape";

/**
 * A simple, immutable Circle.
 *
 * @example
 * const c = new Circle(5);
 * console.log(c.area);            // 78.53981633974483
 * console.log(c.circumference);   // 31.41592653589793
 * console.log(c.toString());      // Circle(radius: 5)
 *
 * // Create from diameter
 * const d = Circle.fromDiameter(10);
 * console.log(d.radius);          // 5
 */
export class Circle extends Shape {

  private _radius: number = 0;

  private _center: Point;

  constructor(center: Point, radius: number) {
    const pts = [center];
    super(pts);

    if (radius < 0) {
      throw new RangeError('Radius must be ≥ 0');
    }
    this._radius = radius;
    this._center = center;
  }

  get radius(): number {
    return this._radius;
  }

  set radius(value: number) {
    this._radius = value;
  }

  get center(): Point {
    return this._center;
  }

  set center(point: Point) {
    this._center = point;
    this._points[0] = this._center;
  }

  get area(): number {
    return Math.PI * this._radius * this._radius;
  }

  // offset(point: Point): Point {
  //   const topLeft = new Point(this._center.x - this._radius, this._center.y - this._radius);
  //   return new Point(point.x - topLeft.x, point.y - topLeft.y);
  // }

  place(point: Point): void {
    this.center = point;
  }

  contains(point: Point): boolean {
    const dx = point.x - this._center.x;
    const dy = point.y - this._center.y;
    return dx * dx + dy * dy <= this._radius * this._radius;
  }

  getConnectablePoints(): Point[] {
    const ret = new Array<Point>();
    ret.push(new Point(this._center.x, this._center.y - this._radius));
    ret.push(new Point(this._center.x + this._radius, this._center.y));
    ret.push(new Point(this._center.x, this._center.y + this._radius));
    ret.push(new Point(this._center.x - this._radius, this._center.y));
    return ret;
  }
}
