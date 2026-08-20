/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/
import {Shape} from "./Shape";
import {Point} from "@/common/Point";

/**
 * A puffy cloud shape: a flat bottom with overlapping round lobes across the
 * top and semicircular sides.
 *
 * Like {@link Circle}, the cloud is anchored by its center point, so the
 * `x`/`y` used to position it refer to the center rather than a corner.
 *
 * @example
 * const cloud = new Cloud(new Point(100, 100), 140, 60);
 */
export class Cloud extends Shape {

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

  /** Radius of each lobe (half the height). */
  get lobeRadius(): number {
    return this._height / 2;
  }

  /** Number of round lobes across the top. */
  get lobeCount(): number {
    return Math.max(3, Math.ceil(this._width / this._height));
  }

  /** Horizontal distance between adjacent lobe centers. */
  get lobeSpacing(): number {
    return Math.max(0, (this._width - this._height) / (this.lobeCount - 1));
  }

  /** X coordinate of the i-th lobe center. */
  private lobeCenterX(i: number): number {
    const left = this._center.x - this._width / 2;
    return left + this.lobeRadius + i * this.lobeSpacing;
  }

  place(point: Point): void {
    this.center = point;
  }

  offset(point: Point): Point {
    return new Point(point.x - this._center.x, point.y - this._center.y);
  }

  contains(point: Point): boolean {
    const left = this._center.x - this._width / 2;
    const right = this._center.x + this._width / 2;
    const top = this._center.y - this._height / 2;
    const bottom = this._center.y + this._height / 2;

    if (point.x < left || point.x > right || point.y < top || point.y > bottom) {
      return false;
    }

    const R = this.lobeRadius;
    const d = this.lobeSpacing;
    const yoff = Math.sqrt(Math.max(0, R * R - (d / 2) * (d / 2)));
    const cy = this._center.y;

    // Inside any lobe circle?
    for (let i = 0; i < this.lobeCount; i++) {
      const dx = point.x - this.lobeCenterX(i);
      const dy = point.y - cy;
      if (dx * dx + dy * dy <= R * R) {
        return true;
      }
    }

    // Flat-bottom fill between the end lobes, below the scallop valleys.
    const fillLeft = left + R;
    const fillRight = right - R;
    return point.y >= cy + yoff && point.x >= fillLeft && point.x <= fillRight;
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
