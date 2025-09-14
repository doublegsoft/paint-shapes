/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

// @ts-ignore
import { Diamond } from "@/shape/Diamond";
// @ts-ignore
import { Point } from "@/common/Point";

describe('Diamond Shape Spec', () => {

  it('square-like contains a top-left point', () => {
    const diamond = new Diamond(new Point(100, 100), 20, 20);
    const containing = diamond.contains(new Point(95, 95));
    expect(containing).toEqual(true);
  });

  it('square-like contains a bottom-left point', () => {
    const diamond = new Diamond(new Point(100, 100), 20, 20);
    const containing = diamond.contains(new Point(95, 105));
    expect(containing).toEqual(true);
  });

  it('square-like contains a top-right point', () => {
    const circle = new Diamond(new Point(100, 100), 20, 20);
    const containing = circle.contains(new Point(105, 95));
    expect(containing).toEqual(true);
  });

  it('square-like contains a bottom-right point', () => {
    const circle = new Diamond(new Point(100, 100), 20, 20);
    const containing = circle.contains(new Point(105, 105));
    expect(containing).toEqual(true);
  });

  it('square-like do not contain a top-left point', () => {
    const circle = new Diamond(new Point(100, 100), 20, 20);
    const containing = circle.contains(new Point(94, 94));
    expect(containing).toEqual(false);
  });

  it('square-like don not contain a bottom-left point', () => {
    const circle = new Diamond(new Point(100, 100), 20, 20);
    const containing = circle.contains(new Point(94, 106));
    expect(containing).toEqual(false);
  });

  it('square-like don not contain a top-right point', () => {
    const circle = new Diamond(new Point(100, 100), 20, 20);
    const containing = circle.contains(new Point(106, 94));
    expect(containing).toEqual(false);
  });

  it('square-like don not contain a bottom-right point', () => {
    const circle = new Diamond(new Point(100, 100), 20, 20);
    const containing = circle.contains(new Point(106, 106));
    expect(containing).toEqual(false);
  });

});