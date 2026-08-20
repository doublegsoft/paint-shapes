/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/
import {ShapeRenderer} from "@/renderer/ShapeRenderer";
import {Shape} from "@/shape/Shape";
import {Cylinder} from "@/shape/Cylinder";

export class CylinderRenderer extends ShapeRenderer {

  render(ctx: CanvasRenderingContext2D, shape: Shape): void {
    const cyl = shape as Cylinder;
    const cx = cyl.center.x;
    const cy = cyl.center.y;
    const rx = cyl.width / 2;
    const ry = cyl.capRadius;
    const left = cx - rx;
    const right = cx + rx;
    const top = cy - cyl.height / 2;
    const bottom = cy + cyl.height / 2;

    ctx.beginPath();

    // Right side down from the top rim.
    ctx.moveTo(right, top + ry);
    ctx.lineTo(right, bottom - ry);

    // Bottom rim: lower half of the ellipse, bulging down.
    ctx.ellipse(cx, bottom - ry, rx, ry, 0, 0, Math.PI);

    // Left side back up.
    ctx.lineTo(left, top + ry);

    // Top face: full round ellipse, drawn as a separate sub-path so no
    // horizontal line joins the body.
    ctx.moveTo(right, top + ry);
    ctx.ellipse(cx, top + ry, rx, ry, 0, 0, Math.PI * 2);

    if (cyl.backgroundColor) {
      ctx.fillStyle = cyl.backgroundColor.hex;
      ctx.fill();
    }

    if (cyl.borderWidth > 0) {
      ctx.lineWidth = cyl.borderWidth;
      ctx.strokeStyle = cyl.borderColor.hex;
      ctx.stroke();
    } else if (cyl.backgroundColor) {
      ctx.strokeStyle = cyl.backgroundColor.hex;
      ctx.stroke();
    }

    if (shape.text != '') {
      ctx.fillStyle = shape.foregroundColor.hex;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(shape.text, cx, cy + cyl.height * 0.28);
    }
  }

}
