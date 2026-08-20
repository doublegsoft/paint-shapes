/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/
import {ShapeRenderer} from "@/renderer/ShapeRenderer";
import {Shape} from "@/shape/Shape";
import {Cloud} from "@/shape/Cloud";

export class CloudRenderer extends ShapeRenderer {

  render(ctx: CanvasRenderingContext2D, shape: Shape): void {
    const cloud = shape as Cloud;
    const cx = cloud.center.x;
    const cy = cloud.center.y;

    const w = cloud.width;
    // 采用饱满的高度比例
    const h = (cloud as any).height || (w * 0.74);

    const x = cx - w / 2;
    const y = cy - h / 2;

    // 1. 绘制扁平投影（阴影效果）
    if (cloud.backgroundColor) {
      ctx.save();
      ctx.translate(0, 6); // 向下平移 6 像素生成立体阴影
      this.defineCloudPath(ctx, x, y, w, h);
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fill();
      ctx.restore();
    }

    // 2. 绘制云朵主体路径
    this.defineCloudPath(ctx, x, y, w, h);

    // 填充背景色
    if (cloud.backgroundColor) {
      ctx.fillStyle = cloud.backgroundColor.hex;
      ctx.fill();
    }

    // 绘制边框
    if (cloud.borderWidth > 0) {
      ctx.lineWidth = cloud.borderWidth;
      ctx.strokeStyle = cloud.borderColor.hex;
      ctx.stroke();
    } else if (cloud.backgroundColor) {
      ctx.strokeStyle = cloud.backgroundColor.hex;
      ctx.stroke();
    }

    // 3. 绘制文本
    if (shape.text != '') {
      ctx.save();
      ctx.fillStyle = shape.foregroundColor.hex;

      // 精确偏置文本坐标，使其在偏左的视觉重心内自然居中
      const textX = cx - w * 0.06;
      const textY = cy + h * 0.12;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(shape.text, textX, textY);
      ctx.restore();
    }
  }

  /**
   * 完美无缝契合包围盒 [x, x+w] 的云朵路径定义，彻底消除左右侧箭头的所有多余空隙
   */
  private defineCloudPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    const baseY = y + 0.85 * h; // 底部水平基准线

    ctx.beginPath();

    // 底座直线左右两端极大程度向外延展，提供平滑且宽阔的底部支撑
    ctx.moveTo(x + 0.15 * w, baseY);

    // 1. 左侧边缘圆弧（控制点拉到负值区 x - 0.06w，迫使弧线的最左侧物理顶点精确触及 x 边界）
    ctx.bezierCurveTo(
      x + 0.06 * w, baseY + 0.05 * h,
      x - 0.06 * w, y + 0.65 * h,
    x + 0.08 * w, y + 0.54 * h
  );

    // 2. 左上方次主峰
    ctx.bezierCurveTo(
      x + 0.04 * w, y + 0.34 * h,
      x + 0.20 * w, y + 0.28 * h,
      x + 0.26 * w, y + 0.38 * h
    );

    // 3. 顶中部主峰（整体靠左）
    ctx.bezierCurveTo(
      x + 0.30 * w, y + 0.10 * h,
      x + 0.48 * w, y + 0.10 * h,
      x + 0.52 * w, y + 0.35 * h
    );

    // 4. 右侧长滑坡过渡弧
    ctx.bezierCurveTo(
      x + 0.58 * w, y + 0.24 * h,
      x + 0.84 * w, y + 0.28 * h,
      x + 0.88 * w, y + 0.48 * h
    );

    // 5. 右侧底角圆弧（控制点拉到超出区 x + 1.08w，迫使弧线的最右侧物理顶点精确触及 x + w 边界）
    ctx.bezierCurveTo(
      x + 1.08 * w, y + 0.60 * h,
    x + 1.00 * w, baseY + 0.05 * h,
    x + 0.88 * w, baseY
  );

    // 闭合底部的水平连线（从右端 0.88w 连回左端 0.15w 起点）
    ctx.lineTo(x + 0.15 * w, baseY);
    ctx.closePath();
  }

}