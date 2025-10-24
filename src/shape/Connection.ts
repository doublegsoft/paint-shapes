/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

import {Shape} from "@/shape/Shape";
import {ShapeRenderer} from "@/renderer/ShapeRenderer";
import {Point} from "@/common/Point";
import {SquareRenderer} from "@/renderer/SquareRenderer";

export class Connection {

  public static LINE_WIDTH: number = 2;

  private readonly _source: Shape;

  private readonly _target: Shape;

  private _label: string = '';

  private _color: string = 'black';

  constructor(source: Shape, target: Shape) {
    this._source = source;
    this._target = target;
  }

  get source(): Shape {
    return this._source;
  }

  get target(): Shape {
    return this._target;
  }

  get label() {
    return this._label;
  }

  set label(label: string) {
    this._label = label;
  }

  get color() {
    return this._color;
  }

  set color(color: string) {
    this._color = color;
  }

  render(ctx: CanvasRenderingContext2D): void {
    let srcPts: Point[] = this._source.getConnectablePoints();
    let tgtPts: Point[] = this._target.getConnectablePoints();
    let srcIdx: number = -1;
    let tgtIdx: number = -1;
    let min = Infinity;
    let pair: Point[] = [new Point(0, 0), new Point(0, 0)];
    for (let i = 0; i < srcPts.length; i++) {
      for (let j = 0; j < tgtPts.length; j++) {
        let dist = srcPts[i].distanceTo(tgtPts[j]);
        if (dist < min) {
          pair[0] = srcPts[i];
          pair[1] = tgtPts[j];
          srcIdx = i;
          tgtIdx = j;
          min = dist;
        }
      }
    }
    //
    const size = 10;
    let angle: number = 90;
    let offsetX: number = 0;
    let offsetY: number = 0;
    for (let i = 0; i < tgtPts.length; i++) {
      if (tgtPts[i].equals(pair[1])) {
        if (i == 0) {
          angle = 180;
          offsetY = -size;
        } else if (i == 1) {
          angle = 270;
          offsetX = size;
        } else if (i == 2) {
          angle = 0;
          offsetY = size;
        } else if (i == 3) {
          angle = 90;
          offsetX = -size;
        }
        break;
      }
    }
    if (min !== Infinity) {
      ctx.lineWidth = Connection.LINE_WIDTH;
      ctx.strokeStyle = this._color;

      // z注意此处的技巧
      ctx.beginPath();
      if ((srcIdx % 2) == (tgtIdx % 2)) {
        const middle = new Point((pair[0].x + pair[1].x) / 2, (pair[0].y + pair[1].y) / 2);
        if (srcIdx % 2 == 0) {
          ctx.moveTo(pair[0].x, pair[0].y);
          ctx.lineTo(pair[0].x, middle.y);
          ctx.lineTo(pair[1].x + offsetX, middle.y);
          ctx.lineTo(pair[1].x + offsetX, pair[1].y + offsetY);
        } else {
          ctx.moveTo(pair[0].x, pair[0].y);
          ctx.lineTo(middle.x, pair[0].y);
          ctx.lineTo(middle.x, pair[1].y + offsetY);
          ctx.lineTo(pair[1].x + offsetX, pair[1].y + offsetY);
        }
      } else if (srcIdx % 2 == 0 && tgtIdx % 2 == 1) {
        const corner = new Point(pair[0].x, pair[1].y);
        ctx.moveTo(pair[0].x, pair[0].y);
        ctx.lineTo(corner.x, corner.y + offsetY);
        ctx.lineTo(pair[1].x + offsetX, pair[1].y + offsetY);
      } else if (srcIdx % 2 == 1 && tgtIdx % 2 == 0) {
        const corner = new Point(pair[1].x, pair[0].y - offsetY);
        ctx.moveTo(pair[0].x, pair[0].y);
        ctx.lineTo(corner.x, corner.y + offsetY);
        ctx.lineTo(pair[1].x + offsetX, pair[1].y + offsetY);
      }
      ctx.stroke();
      ctx.closePath();
    }
    this.renderArrowHead(ctx, pair[1].x, pair[1].y, angle, size);
  }

  renderArrowHead(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, size = 15) {
    ctx.fillStyle = '#2c3e50';
    const offset = Connection.LINE_WIDTH / 2;
    ctx.beginPath();
    if (angle == 0) {
      // top
      x += offset;
      ctx.moveTo(x, y);
      ctx.lineTo(x - size / 2, y + size);
      ctx.lineTo(x + size / 2, y + size);
      ctx.moveTo(x, y);
    } else if (angle == 90) {
      // right
      y += offset;
      ctx.moveTo(x, y);
      ctx.lineTo(x - size, y - size / 2);
      ctx.lineTo(x - size, y + size / 2);
      ctx.moveTo(x, y);
    } else if (angle == 180) {
      // bottom
      x += offset;
      ctx.moveTo(x, y);
      ctx.lineTo(x - size / 2, y - size);
      ctx.lineTo(x + size / 2, y - size);
      ctx.moveTo(x, y);
    } else if (angle == 270) {
      // left
      y += offset;
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y - size / 2);
      ctx.lineTo(x + size, y + size / 2);
      ctx.moveTo(x, y);
    }

    ctx.stroke();
    ctx.closePath();
    ctx.fill();
  }

  renderCornerLine(ctx: CanvasRenderingContext2D, source: Point, target: Point, offsetX: number, offsetY: number): void{

  }

  renderDirectLine(ctx: CanvasRenderingContext2D, source: Point, target: Point, offsetX: number, offsetY: number): void {

  }
}