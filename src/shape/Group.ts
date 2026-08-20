/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

import {Shape} from "./Shape";
import {Point} from "@/common/Point";

/**
 * A composite shape that groups several shapes into one unit: selection and
 * movement apply to the whole group at once.
 *
 * The group anchor (its first point) is the top‑left corner of the bounding
 * box that wraps all children, so dragging behaves like dragging a rectangle.
 */
export class Group extends Shape {

  private _shapes: Shape[] = [];

  private _width: number = 0;

  private _height: number = 0;

  private _padding: number = 20;

  private _title: string = '';

  constructor(shapes: Shape[] = []) {
    super([new Point(0, 0)]);
    this._shapes = [...shapes];
    this.recalculate();
  }

  get shapes(): Shape[] {
    return this._shapes;
  }

  get topLeft(): Point {
    return this._points[0];
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get padding(): number {
    return this._padding;
  }

  set padding(value: number) {
    this._padding = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  add(shape: Shape): void {
    this._shapes.push(shape);
    this.recalculate();
  }

  contains(point: Point): boolean {
    return this._shapes.some(shape => shape.contains(point));
  }

  getConnectablePoints(): Point[] {
    const topLeft = this._points[0];
    return [
      new Point(topLeft.x + this._width / 2, topLeft.y),
      new Point(topLeft.x + this._width, topLeft.y + this._height / 2),
      new Point(topLeft.x + this._width / 2, topLeft.y + this._height),
      new Point(topLeft.x, topLeft.y + this._height / 2),
    ];
  }

  move(dx: number, dy: number): void {
    for (let i = 0; i < this._shapes.length; i++) {
      this._shapes[i].move(dx, dy);
    }
    super.move(dx, dy);
  }

  place(point: Point): void {
    const anchor = this._points[0];
    this.move(point.x - anchor.x, point.y - anchor.y);
  }

  /**
   * Recomputes the bounding box (top‑left, width and height) from the union of
   * every child’s connectable points, which mark each shape’s outer extents.
   */
  private recalculate(): void {
    if (this._shapes.length === 0) {
      this._points[0] = new Point(0, 0);
      this._width = 0;
      this._height = 0;
      return;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < this._shapes.length; i++) {
      const points = this._shapes[i].getConnectablePoints();
      for (let j = 0; j < points.length; j++) {
        const p = points[j];
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
    }

    this._points[0] = new Point(minX, minY);
    this._width = maxX - minX;
    this._height = maxY - minY;
  }
}
