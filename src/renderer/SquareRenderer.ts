/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/
import { ShapeRenderer } from "@/renderer/ShapeRenderer";
import { Shape } from "@/shape/Shape";
import {Square} from "@/shape/Square";

export class SquareRenderer extends ShapeRenderer {

  render(ctx: CanvasRenderingContext2D, shape: Shape): void {
    const square = shape as Square;
    if (square.borderRadius > 0) {
      ctx.strokeStyle = square.borderColor.hex;
      ctx.lineWidth = square.borderWidth;

      if (square.backgroundColor) {
        ctx.fillStyle = square.backgroundColor.hex;
        ctx.fillRect(square.topLeft.x, square.topLeft.y, square.side, square.side);
      }
      ctx.strokeRect(square.topLeft.x, square.topLeft.y, square.side, square.side);
    } else {
      ShapeRenderer.renderRoundedRect(ctx,
        square.topLeft.x, square.topLeft.y, square.side, square.side,
        square.borderRadius, square.borderWidth, square.borderColor,
        square.backgroundColor);
    }
  }

}