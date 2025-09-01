/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

import {Shape} from "@/shape/Shape";
import {ShapeRenderer} from "@/renderer/ShapeRenderer";

export class Connection {

  private readonly _source: Shape;

  private readonly _target: Shape;

  private _label: string = '';

  constructor(source: Shape, target: Shape) {
    this._source = source;
    this._target = target;
  }

  get source(): Shape {
    return this._source;
  }

  get target(): Shape {
    return this._target;
  }

  get label() {
    return this._label;
  }

  set label(label: string) {
    this._label = label;
  }
}