/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

import { Shape } from "./Shape";
import { Point } from "@/common/Point";

export class Rectangle extends Shape {

  private _width: number = 0;

  private _height: number = 0;

  public get topLeft(): Point {
      return this._points[0];
  }

  public get width(): number {
    return this._width;
  }

  public set width(value: number) {
    this._width = value;
  }

  public get height(): number {
    return this._height;
  }

  public set height(value: number) {
    this._height = value;
  }

  /**
   * @param topLeft  the upper‑left corner of the rectangle
   * @param width    must be > 0
   * @param height   must be > 0
   */
  constructor(topLeft: Point, width: number, height: number) {
    const pts = [
      topLeft,
      new Point(topLeft.x + width, topLeft.y),                // top‑right
      new Point(topLeft.x + width, topLeft.y + height),       // bottom‑right
      new Point(topLeft.x, topLeft.y + height),               // bottom‑left
    ];
    super(pts);

    if (width <= 0 || height <= 0) {
      throw new Error('Width and height must be greater than 0.');
    }
    this._width = width;
    this._height = height;
  }

  contains(point: Point): boolean {
    const topLeft = this._points[0];
    return point.x >= topLeft.x && (topLeft.x + this._width) >= point.x &&
      point.y >= topLeft.y && (topLeft.y + this._height) >= point.y;
  }

  getConnectablePoints(): Point[] {
    const ret = new Array<Point>();
    const topLeft = this._points[0];
    ret.push(new Point(topLeft.x + this._width / 2, topLeft.y));
    ret.push(new Point(topLeft.x + this._width, topLeft.y + this._height / 2));
    ret.push(new Point(topLeft.x + this._width / 2, topLeft.y + this._height));
    ret.push(new Point(topLeft.x, topLeft.y + this._height / 2));
    return ret;
  }
}