/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

import { Point } from "../common/Point";
import { Rectangle } from "./Rectangle";

export class Square extends Rectangle {
  
  /** @param topLeft   the upper‑left corner of the square
   *  @param side      must be > 0
   */
  constructor(topLeft: Point, side: number) {
    if (side <= 0) {
      throw new Error('Side length must be > 0.');
    }
    // width = height = side
    super(topLeft, side, side);
  }

  /* ---------------------------------  Convenience  --------------------------------- */
  /** Read‑only side length (same as width or height). */
  get sideLength(): number {
    return this.width;          // width === height by construction
  }

  contains(point: Point): boolean {
    throw new Error("Method not implemented.");
  }
}