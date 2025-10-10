/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

import { Point } from "../common/Point";
import { Rectangle } from "./Rectangle";

export class Square extends Rectangle {

  private _side: number = 0;

  constructor(topLeft: Point, side: number) {
    if (side <= 0) {
      throw new Error('Side length must be > 0.');
    }
    super(topLeft, side, side);
    this._side = side;
  }

  get topLeft(): Point {
    return this._points[0];
  }

  set topLeft(value: Point) {
    this._points[0] = value;
  }

  get side(): number {
    return this._side;
  }

  set side(value: number) {
    this._side = value;
  }

  contains(point: Point): boolean {
    const topLeft = this._points[0];
    return point.x >= topLeft.x && (topLeft.x + this._side) >= point.x &&
      point.y >= topLeft.y && (topLeft.y + this._side) >= point.y;
  }

  getConnectablePoints(): Point[] {
    const ret = new Array<Point>();
    const topLeft = this._points[0];
    ret.push(new Point(topLeft.x + this._side / 2, topLeft.y));
    ret.push(new Point(topLeft.x + this._side, topLeft.y + this._side / 2));
    ret.push(new Point(topLeft.x + this._side / 2, topLeft.y + this._side));
    ret.push(new Point(topLeft.x, topLeft.y + this._side / 2));
    return ret;
  }
}