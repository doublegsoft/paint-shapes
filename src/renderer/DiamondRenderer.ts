/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/
import { ShapeRenderer } from "@/renderer/ShapeRenderer";
import { Shape } from "@/shape/Shape";
import {Diamond} from "@/shape/Diamond";
import {Point} from "@/common/Point";

export class DiamondRenderer extends ShapeRenderer {

  render(ctx: CanvasRenderingContext2D, shape: Shape): void {
    const diamond = shape as Diamond;
    const top = new Point(diamond.center.x, diamond.center.y - diamond.height / 2);
    const right = new Point(diamond.center.x + diamond.width / 2, diamond.center.y);
    const bottom = new Point(diamond.center.x, diamond.center.y + diamond.height / 2);
    const left = new Point(diamond.center.x - diamond.width / 2, diamond.center.y);

    ctx.strokeStyle = diamond.borderColor.hex;
    ctx.lineWidth = diamond.borderWidth;

    if (diamond.backgroundColor) {
      ctx.fillStyle = diamond.backgroundColor.hex;
    }
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(right.x, right.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.lineTo(left.x, left.y);
    ctx.lineTo(top.x, top.y);
    ctx.closePath();

    ctx.fill('nonzero');
    ctx.stroke();

    if (shape.text != '') {
      ctx.fillStyle = shape.foregroundColor.hex;
      const metrics = ctx.measureText(shape.text);
      const width = metrics.width;
      const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      ctx.fillText(shape.text,
        left.x + (diamond.width - width) / 2,
        top.y + (diamond.height + height) / 2);
    }
  }

}