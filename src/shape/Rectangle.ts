/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

import { Shape } from "./Shape";
import { Point } from "../common/Point";

export class Rectangle extends Shape {

  /**
   * @param topLeft  the upper‑left corner of the rectangle
   * @param width    must be > 0
   * @param height   must be > 0
   */
  constructor(
    public readonly topLeft: Point,
    public readonly width: number,
    public readonly height: number
  ) {

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
  }

  protected cloneWithPoints(newPoints: Point[]): this {
    return new Rectangle(newPoints[0], this.width, this.height) as this;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(this.topLeft.x, this.topLeft.y, this.width, this.height);
    ctx.fill();
    ctx.stroke();
  }

  contains(point: Point): boolean {
    throw new Error("Method not implemented.");
  }
}