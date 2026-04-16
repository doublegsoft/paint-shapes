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
    this._alpha = alpha || -1;
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

    if (this._alpha === -1) {
      return (
        "#" +
        [r, g, b]
          .map(v => v.toString(16).padStart(2, "0"))
          .join("")
      );
    }
    const a = Math.round(
      Math.max(0, Math.min(1, this._alpha)) * 255
    );

    return (
      "#" +
      [r, g, b, a]
        .map(v => v.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  public static from(hex: string): Color {
    if (!hex) {
      throw new Error("Invalid hex color");
    }

    let clean = hex.replace("#", "").trim();

    // #RGB → #RRGGBB
    if (clean.length === 3) {
      clean = clean.split("").map(c => c + c).join("");
    }

    // 支持 #RRGGBB 或 #RRGGBBAA
    if (clean.length !== 6 && clean.length !== 8) {
      throw new Error("Invalid hex format");
    }

    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);

    if (clean.length === 8) {
      const alphaHex = clean.substring(6, 8);
      let a = parseInt(alphaHex, 16) / 255;
      return new Color(r, g, b, a);
    } else {
      return new Color(r, g, b);
    }
  }

}