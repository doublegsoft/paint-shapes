/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/
import { Shape } from "@/shape/Shape";
import {Circle} from "@/shape/Circle";
import {CircleRenderer} from "@/renderer/CircleRenderer";
import {Square} from "@/shape/Square";
import {SquareRenderer} from "@/renderer/SquareRenderer";

export class FlatPlayground {

  public static CIRCLE_RENDERER: CircleRenderer = new CircleRenderer();

  public static SQUARE_RENDERER: SquareRenderer = new SquareRenderer();

  private _width: number = 0;

  private _height: number = 0;

  private _shapes: Shape[] = [];

  private readonly _ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx;
  }

  render() {
    this._ctx.clearRect(0, 0, this._width, this._height);
    const shapes = this._shapes.sort((a, b) => a.depth - a.depth);
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      if (shape instanceof Circle) {
        FlatPlayground.CIRCLE_RENDERER.render(this._ctx, shape);
      } else if (shape instanceof Square) {
        FlatPlayground.SQUARE_RENDERER.render(this._ctx, shape);
      }
    }
  }

  addShape(shape: Shape) {
    this._shapes.push(shape);
    this.render();
  }

}