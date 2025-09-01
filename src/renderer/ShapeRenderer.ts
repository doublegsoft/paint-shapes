/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/
import { Shape } from "@/shape/Shape";
import {Color} from "@/common/Color";

export abstract class ShapeRenderer {

  /**
   * Renders a shape in two-dimensional plane.
   */
  abstract render(ctx: CanvasRenderingContext2D, shape: Shape): void;

  /**
   * Draws a rectangle with the same radius on all four corners.
   * Works in all browsers that support CanvasRenderingContext2D.
   */
  static renderRoundedRect(ctx: CanvasRenderingContext2D,
                           x: number, y: number, width: number, height: number,
                           borderRadius: number,
                           borderWidth: number,
                           borderColor: Color,
                           backgroundColor: Color) {
    ctx.beginPath();
    ctx.moveTo(x + borderRadius, y);
    ctx.lineTo(x + width - borderRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
    ctx.lineTo(x + width, y + height - borderRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
    ctx.lineTo(x + borderRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
    ctx.lineTo(x, y + borderRadius);
    ctx.quadraticCurveTo(x, y, x + borderRadius, y);
    ctx.closePath();

    if (backgroundColor) {
      ctx.fillStyle = backgroundColor.hex;
    }
    ctx.strokeStyle = borderColor.hex;
    ctx.lineWidth = borderWidth;

    if (backgroundColor) {
      ctx.fill();
    }
    ctx.stroke();
  }
}