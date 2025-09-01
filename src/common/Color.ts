/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

export class Color {

  public static readonly transparent: Color = new Color(255,255,255, 1);

  public static readonly white = new Color(255, 255, 255);

  public static readonly black = new Color(0, 0, 0);

  private _red: number = 0;

  private _green: number = 0;

  private _blue: number = 0;

  private _alpha: number = 0;

  constructor(red: number, green: number, blue: number, alpha?: number) {
    this._red = red;
    this._green = green;
    this._blue = blue;
    this._alpha = alpha || 0;
  }

  set red(value: number) {
    this._red = value;
  }

  set green(value: number) {
    this._green = value;
  }

  set blue(value: number) {
    this._blue = value;
  }

  set alpha(value: number) {
    this._alpha = value;
  }

  get hex() {
    const r = Math.max(0, Math.min(255, this._red));
    const g = Math.max(0, Math.min(255, this._green));
    const b = Math.max(0, Math.min(255, this._blue));

    return ("#" +
      ((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
    );
  }
}