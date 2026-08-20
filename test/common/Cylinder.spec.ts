/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

// @ts-ignore
import { Cylinder } from "@/shape/Cylinder";
// @ts-ignore
import { Point } from "@/common/Point";

describe('Cylinder Shape Spec', () => {

  // Cylinder(100, 100, 120, 60) -> rx=60, ry=min(21.6,16.8)=16.8, body y in [96.8, 103.2]
  it('contains its center point', () => {
    const cyl = new Cylinder(new Point(100, 100), 120, 60);
    expect(cyl.contains(new Point(100, 100))).toEqual(true);
  });

  it('contains a body point', () => {
    const cyl = new Cylinder(new Point(100, 100), 120, 60);
    expect(cyl.contains(new Point(130, 100))).toEqual(true);
  });

  it('contains a top cap point', () => {
    const cyl = new Cylinder(new Point(100, 100), 120, 60);
    expect(cyl.contains(new Point(100, 74))).toEqual(true);
  });

  it('contains a bottom cap point', () => {
    const cyl = new Cylinder(new Point(100, 100), 120, 60);
    expect(cyl.contains(new Point(100, 128))).toEqual(true);
  });

  it('does not contain a point outside the box', () => {
    const cyl = new Cylinder(new Point(100, 100), 120, 60);
    expect(cyl.contains(new Point(170, 100))).toEqual(false);
  });

  it('does not contain a point in the top cap corner', () => {
    const cyl = new Cylinder(new Point(100, 100), 120, 60);
    expect(cyl.contains(new Point(155, 72))).toEqual(false);
  });

  it('check offset', () => {
    const cyl = new Cylinder(new Point(100, 100), 120, 60);
    const offset = cyl.offset(new Point(110, 106));
    expect(offset).toEqual(new Point(10, 6));
  });

});
