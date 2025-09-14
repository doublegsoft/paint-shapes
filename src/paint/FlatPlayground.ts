/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/
import {Shape} from "@/shape/Shape";
import {Circle} from "@/shape/Circle";
import {CircleRenderer} from "@/renderer/CircleRenderer";
import {Square} from "@/shape/Square";
import {SquareRenderer} from "@/renderer/SquareRenderer";
import {Point} from "@/common/Point";
import {Color} from "@/common/Color";

export class FlatPlayground {

  public static CIRCLE_RENDERER: CircleRenderer = new CircleRenderer();

  public static SQUARE_RENDERER: SquareRenderer = new SquareRenderer();

  private _width: number = 0;

  private _height: number = 0;

  private _shapes: Shape[] = [];

  private readonly _ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this._ctx = ctx;
    this._width = width;
    this._height = height;
  }

  render(): void {
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

  select(x: number, y: number): Shape {
    let retVal:Shape | null = null;
    const p: Point = new Point(x, y);
    for (let i = 0; i < this._shapes.length; i++) {
      this._shapes[i].borderWidth = 0;
      this._shapes[i].borderColor = Color.transparent;
    }
    for (let i = 0; i < this._shapes.length; i++) {
      if (this._shapes[i].contains(p)) {
        this._shapes[i].borderWidth = 2;
        this._shapes[i].borderColor = new Color(122, 36, 188);
        retVal = this._shapes[i];
      }
    }
    this.render();
    return <Shape>retVal;
  }

  addShape(shape: Shape): void {
    this._shapes.push(shape);
    this.render();
  }

  shiftShape(shape: Shape, mousepos: Point, offset: Point): void {
    if (shape instanceof Circle) {
      shape.place(new Point(mousepos.x - offset.x, mousepos.y - offset.y));
    } else {
      shape.place(new Point(mousepos.x - offset.x, mousepos.y - offset.y));
    }
    this.render();
  }
}