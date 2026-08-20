/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

// @ts-ignore
import { Cloud } from "@/shape/Cloud";
// @ts-ignore
import { Point } from "@/common/Point";

describe('Cloud Shape Spec', () => {

  // Cloud(100, 100, 60, 40) -> 3 lobes, radius 20, centers x = 90/100/110, y = 100
  it('contains its center point', () => {
    const cloud = new Cloud(new Point(100, 100), 60, 40);
    expect(cloud.contains(new Point(100, 100))).toEqual(true);
  });

  it('contains a lobe peak point', () => {
    const cloud = new Cloud(new Point(100, 100), 60, 40);
    expect(cloud.contains(new Point(100, 80))).toEqual(true);
  });

  it('contains a lower body point', () => {
    const cloud = new Cloud(new Point(100, 100), 60, 40);
    expect(cloud.contains(new Point(100, 112))).toEqual(true);
  });

  it('contains a flat-bottom fill point', () => {
    const cloud = new Cloud(new Point(100, 100), 60, 40);
    expect(cloud.contains(new Point(105, 119.8))).toEqual(true);
  });

  it('does not contain a point above the top', () => {
    const cloud = new Cloud(new Point(100, 100), 60, 40);
    expect(cloud.contains(new Point(100, 75))).toEqual(false);
  });

  it('does not contain a point outside the box', () => {
    const cloud = new Cloud(new Point(100, 100), 60, 40);
    expect(cloud.contains(new Point(140, 100))).toEqual(false);
  });

  it('check offset', () => {
    const cloud = new Cloud(new Point(100, 100), 60, 40);
    const offset = cloud.offset(new Point(108, 105));
    expect(offset).toEqual(new Point(8, 5));
  });

});
