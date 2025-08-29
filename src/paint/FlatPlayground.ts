/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/
import { Shape } from "@/shape/Shape";

export class FlatPlayground {

  private _width: number = 0;

  private _height: number = 0;

  private _shapes: Shape[] = [];

  private _ctx: CanvasRenderingContext2D | null = null;

  constructor(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx;
  }

  render() {
    const shapes = this._shapes.sort((a, b) => a.depth - a.depth);
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
    }
  }

  addShape(shape: Shape) {
    this._shapes.push(shape);
    this.render();
  }

}