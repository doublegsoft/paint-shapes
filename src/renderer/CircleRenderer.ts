/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/
import { Shape } from "@/shape/Shape";
import { Circle } from "@/shape/Circle";
import { ShapeRenderer } from "@/renderer/ShapeRenderer";

export class CircleRenderer extends ShapeRenderer {

  render(ctx: CanvasRenderingContext2D, shape: Shape): void {
    const circle = shape as Circle;
    ctx.beginPath();
    ctx.arc(circle.center.x, circle.center.y, circle.radius, 0, Math.PI * 2);
    ctx.closePath();

    if (circle.borderWidth > 0){
      ctx.lineWidth   = circle.borderWidth;
      ctx.strokeStyle = circle.borderColor.hex;
      ctx.stroke();
    }

    if (circle.backgroundColor) {
      ctx.fillStyle = circle.backgroundColor.hex;
      ctx.fill();
    }
  }

}