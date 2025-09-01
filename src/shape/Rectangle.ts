/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

import { Shape } from "./Shape";
import { Point } from "@/common/Point";

export class Rectangle extends Shape {

  private _topLeft: Point;

  private _width: number = 0;

  private _height: number = 0;

  public get topLeft(): Point {
      return this._topLeft;
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
    this._topLeft = topLeft;

  }

  contains(point: Point): boolean {
    throw new Error("Method not implemented.");
  }
}