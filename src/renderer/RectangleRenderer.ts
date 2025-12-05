/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/
import { ShapeRenderer } from "@/renderer/ShapeRenderer";
import { Shape } from "@/shape/Shape";
import {Rectangle} from "@/shape/Rectangle";

export class RectangleRenderer extends ShapeRenderer {

  render(ctx: CanvasRenderingContext2D, shape: Shape): void {
    const rect = shape as Rectangle;
    if (rect.borderRadius == 0) {
      ctx.strokeStyle = rect.borderColor.hex;
      ctx.lineWidth = rect.borderWidth;
      if (rect.backgroundColor) {
        ctx.fillStyle = rect.backgroundColor.hex;
        ctx.fillRect(rect.topLeft.x, rect.topLeft.y, rect.width, rect.height);
      }
      ctx.strokeRect(rect.topLeft.x, rect.topLeft.y, rect.width, rect.height);
    } else {
      ShapeRenderer.renderRoundedRect(ctx,
        rect.topLeft.x, rect.topLeft.y, rect.width, rect.height,
        rect.borderRadius, rect.borderWidth, rect.borderColor,
        rect.backgroundColor);
    }
    if (shape.text != '') {
      ctx.fillStyle = shape.foregroundColor.hex;
      const metrics = ctx.measureText(shape.text);
      const width = metrics.width;
      const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      ctx.fillText(shape.text,
        rect.topLeft.x + (rect.width - width) / 2,
        rect.topLeft.y + (rect.height + height) / 2);
    }
  }

}