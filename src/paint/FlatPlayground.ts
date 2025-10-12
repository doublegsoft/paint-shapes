/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/
import {Shape} from "@/shape/Shape";
import {Circle} from "@/shape/Circle";
import {Square} from "@/shape/Square";
import {Diamond} from "@/shape/Diamond";
import {Rectangle} from "@/shape/Rectangle";
import {Connection} from "@/shape/Connection";
import {Point} from "@/common/Point";
import {Color} from "@/common/Color";

import {CircleRenderer} from "@/renderer/CircleRenderer";
import {SquareRenderer} from "@/renderer/SquareRenderer";
import {DiamondRenderer} from "@/renderer/DiamondRenderer";
import {RectangleRenderer} from "@/renderer/RectangleRenderer";


export class FlatPlayground {

  public static CIRCLE_RENDERER: CircleRenderer = new CircleRenderer();

  public static SQUARE_RENDERER: SquareRenderer = new SquareRenderer();

  public static RECTANGLE_RENDERER: RectangleRenderer = new RectangleRenderer();

  public static DIAMOND_RENDERER: DiamondRenderer = new DiamondRenderer();

  private _width: number = 0;

  private _height: number = 0;

  private _shapes: Shape[] = [];

  private _connections: Connection[] = [];

  private readonly _ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this._ctx = ctx;
    this._width = width;
    this._height = height;
  }

  render(): void {
    this._ctx.clearRect(0, 0, this._width, this._height);
    this.drawBackground();
    const shapes = this._shapes.sort((a, b) => a.depth - a.depth);
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      if (shape instanceof Circle) {
        FlatPlayground.CIRCLE_RENDERER.render(this._ctx, shape);
      } else if (shape instanceof Square) {
        FlatPlayground.SQUARE_RENDERER.render(this._ctx, shape);
      } else if (shape instanceof Rectangle) {
        FlatPlayground.RECTANGLE_RENDERER.render(this._ctx, shape);
      }else if (shape instanceof Diamond) {
        FlatPlayground.DIAMOND_RENDERER.render(this._ctx, shape);
      }
    }

    for (let i = 0; i < this._connections.length; i++) {
      this._connections[i].render(this._ctx);
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
    shape.place(new Point(mousepos.x - offset.x, mousepos.y - offset.y));
    this.render();
  }

  drawBackground({
    dotRadius = 1,
    spacing = 20,
    dotColor = '#999',
    background = '#fff'
  } = {}) {
    const ctx = this._ctx;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, this._width, this._height);

    // Compute how many columns/rows we need
    const cols = Math.ceil(this._width / spacing);
    const rows = Math.ceil(this._height / spacing);

    ctx.fillStyle = dotColor;
    for (let y = 0; y < rows; ++y) {
      for (let x = 0; x < cols; ++x) {
        const cx = x * spacing + spacing / 2;
        const cy = y * spacing + spacing / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawArrowHead(x: number, y: number, angle: number, size = 15) {
    this._ctx.save();
    this._ctx.translate(x, y);
    this._ctx.rotate(angle);

    this._ctx.fillStyle = '#2c3e50';
    this._ctx.beginPath();
    this._ctx.moveTo(0, 0);
    this._ctx.lineTo(-size, -size/2);
    this._ctx.lineTo(-size, size/2);
    this._ctx.closePath();
    this._ctx.fill();
    this._ctx.restore();
  }

  drawQuadraticCurveWithArrow(startPoint: Point, endPoint: Point, controlOffset = 100) {
    const midX = (startPoint.x + endPoint.x) / 2;
    const midY = (startPoint.y + endPoint.y) / 2;

    // Calculate control point (offset perpendicular to the line)
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    const controlX = midX - (dy / length) * controlOffset;
    const controlY = midY + (dx / length) * controlOffset;

    // Draw the curve
    this._ctx.strokeStyle = '#e74c3c';
    this._ctx.lineWidth = 3;
    this._ctx.beginPath();
    this._ctx.moveTo(startPoint.x, startPoint.y);
    this._ctx.quadraticCurveTo(controlX, controlY, endPoint.x, endPoint.y);
    this._ctx.stroke();

    // Calculate arrow direction
    const t = 0.9; // Position along curve for arrow (90%)
    const arrowX = (1-t)*(1-t)*startPoint.x + 2*(1-t)*t*controlX + t*t*endPoint.x;
    const arrowY = (1-t)*(1-t)*startPoint.y + 2*(1-t)*t*controlY + t*t*endPoint.y;

    // Calculate tangent direction
    const tangentX = 2*(1-t)*(controlX - startPoint.x) + 2*t*(endPoint.x - controlX);
    const tangentY = 2*(1-t)*(controlY - startPoint.y) + 2*t*(endPoint.y - controlY);
    const angle = Math.atan2(tangentY, tangentX);

    this.drawArrowHead(arrowX, arrowY, 90);
  }

  addConnection(startPoint: Point, endPoint: Point, cp1Offset: number = 50, cp2Offset = 50) {
    // Calculate control points
    const cp1x = startPoint.x + cp1Offset;
    const cp1y = startPoint.y - cp1Offset;
    const cp2x = endPoint.x - cp2Offset;
    const cp2y = endPoint.y - cp2Offset;

    // Draw the curve
    this._ctx.strokeStyle = '#9b59b6';
    this._ctx.lineWidth = 3;
    this._ctx.beginPath();
    this._ctx.moveTo(startPoint.x, startPoint.y);
    this._ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endPoint.x, endPoint.y);
    this._ctx.stroke();

    // Calculate arrow direction at end of curve
    const tangentX = 3 * (endPoint.x - cp2x);
    const tangentY = 3 * (endPoint.y - cp2y);
    const angle = Math.atan2(tangentY, tangentX);

    this.drawArrowHead(endPoint.x, endPoint.y, 90);
  }

  connect(source: Shape, target: Shape): void {
    const conn = new Connection(source, target);
    for (let cn of this._connections) {
      // TODO
    }
    this._connections.push(conn);
    this.render();
  }
}