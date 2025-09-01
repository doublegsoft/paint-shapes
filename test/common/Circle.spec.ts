/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

// @ts-ignore
import { Circle } from "@/shape/Circle";
// @ts-ignore
import { Point } from "@/common/Point";

describe('Circle Shape Spec', () => {

  it('contains a point', () => {
    const circle = new Circle(new Point(100, 100), 10);
    const containing = circle.contains(new Point(95, 95));
    expect(containing).toEqual(true);
  });

  it('not contain a point', () => {
    const circle = new Circle(new Point(100, 100), 10);
    const containing = circle.contains(new Point(115, 115));
    expect(containing).toEqual(false);
  });

  it('check offset', () => {
    const circle = new Circle(new Point(100, 100), 10);
    const offset = circle.offset(new Point(95, 95));
    expect(offset).toEqual(new Point(5, 5));
  });

});