// src/common/Point.ts
var Point = class {
  /**
   * Constructs a new Point.
   * @param x - The X coordinate.
   * @param y - The Y coordinate.
   * @param z - The Z coordinate.
   */
  constructor(x, y, z) {
    /** Z coordinate */
    this.z = 0;
    this.x = x;
    this.y = y;
    if (typeof z !== "undefined") {
      this.z = z;
    } else {
      this.z = 0;
    }
  }
  toString() {
    if (typeof this.z === "undefined") {
      return `Point(${this.x}, ${this.y})`;
    } else {
      return `Point(${this.x}, ${this.y}, ${this.z})`;
    }
  }
  /**
   * Euclidean distance to another point.
   * @param other - The other point.
   * @returns The distance.
   */
  distanceTo(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    if (typeof this.z === "undefined") {
      return Math.sqrt(dx * dx + dy * dy);
    } else {
      const dz = this.z - other.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
  }
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
};

// src/common/Color.ts
var _Color = class _Color {
  constructor(red, green, blue, alpha) {
    this._red = 0;
    this._green = 0;
    this._blue = 0;
    this._alpha = 0;
    this._red = red;
    this._green = green;
    this._blue = blue;
    this._alpha = alpha || -1;
  }
  set red(value) {
    this._red = value;
  }
  set green(value) {
    this._green = value;
  }
  set blue(value) {
    this._blue = value;
  }
  set alpha(value) {
    this._alpha = value;
  }
  get hex() {
    const r = Math.max(0, Math.min(255, this._red));
    const g = Math.max(0, Math.min(255, this._green));
    const b = Math.max(0, Math.min(255, this._blue));
    if (this._alpha === -1) {
      return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    }
    const a = Math.round(
      Math.max(0, Math.min(1, this._alpha)) * 255
    );
    return "#" + [r, g, b, a].map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  static from(hex) {
    if (!hex) {
      throw new Error("Invalid hex color");
    }
    let clean = hex.replace("#", "").trim();
    if (clean.length === 3) {
      clean = clean.split("").map((c) => c + c).join("");
    }
    if (clean.length !== 6 && clean.length !== 8) {
      throw new Error("Invalid hex format");
    }
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (clean.length === 8) {
      const alphaHex = clean.substring(6, 8);
      let a = parseInt(alphaHex, 16) / 255;
      return new _Color(r, g, b, a);
    } else {
      return new _Color(r, g, b);
    }
  }
};
_Color.transparent = new _Color(255, 255, 255, 1);
_Color.white = new _Color(255, 255, 255);
_Color.black = new _Color(0, 0, 0);
var Color = _Color;

// src/shape/Shape.ts
var Shape = class {
  /**
   * @param points List of vertices that define the shape.
   *               Must contain at least two points (otherwise the shape is degenerate).
   */
  constructor(points) {
    this._id = "";
    this._borderRadius = 0;
    this._foregroundColor = Color.black;
    this._backgroundColor = Color.transparent;
    this._borderColor = Color.transparent;
    this._borderWidth = 0;
    this._text = "";
    if (points.length == 0) {
      throw new Error("A shape must have at least one point.");
    }
    this._points = [...points];
  }
  set foregroundColor(value) {
    this._foregroundColor = value;
  }
  get foregroundColor() {
    return this._foregroundColor;
  }
  set backgroundColor(value) {
    this._backgroundColor = value;
  }
  get backgroundColor() {
    return this._backgroundColor;
  }
  set borderColor(value) {
    this._borderColor = value;
  }
  get borderColor() {
    return this._borderColor;
  }
  set borderWidth(value) {
    this._borderWidth = value;
  }
  get borderWidth() {
    return this._borderWidth;
  }
  set borderRadius(value) {
    this._borderRadius = value;
  }
  get borderRadius() {
    return this._borderRadius;
  }
  set text(value) {
    this._text = value;
  }
  get text() {
    return this._text;
  }
  set id(value) {
    this._id = value;
  }
  get id() {
    return this._id;
  }
  /**
   * if in 2d context, depth means draw order for shapes.
   */
  get depth() {
    return this._points[0].z || 0;
  }
  /**
   * Translates (moves) the shape by a vector.
   *
   * The concrete shape can choose to either mutate the existing points or
   * return a new shape instance – here we mutate in place for simplicity.
   */
  translate(nx, ny) {
    const p = this._points[0];
    const dx = p.x - nx;
    const dy = p.y - ny;
    for (let i = 0; i < this._points.length; i++) {
      const p2 = this._points[i];
      p2.x = p2.x - dx;
      p2.y = p2.y - dy;
    }
  }
  /** 
   * Rotates the shape around a pivot point by a given angle (in degrees). 
   */
  rotate(angleDeg, pivot = new Point(0, 0)) {
    const rad = angleDeg * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    for (let i = 0; i < this._points.length; i++) {
      const p = this._points[i];
      const x = p.x - pivot.x;
      const y = p.y - pivot.y;
      const nx = x * cos - y * sin + pivot.x;
      const ny = x * sin + y * cos + pivot.y;
      p.x = nx;
      p.y = ny;
    }
  }
  /**
   * Moves every point of the shape by the given delta (dx, dy).
   *
   * Used by {@link Group} to translate its children together. For shapes that
   * keep a center (e.g. Circle, Diamond) the first point is the same object as
   * that center, so shifting it also updates the center automatically.
   */
  move(dx, dy) {
    for (let i = 0; i < this._points.length; i++) {
      const p = this._points[i];
      p.x += dx;
      p.y += dy;
    }
  }
  /**
   * Gets offset relative to the top-left point according to the given point.
   */
  offset(point) {
    const topLeft = this._points[0];
    return new Point(point.x - topLeft.x, point.y - topLeft.y);
  }
  place(point) {
    this._points[0] = point;
  }
  equals(shape) {
    let typeOfThis = typeof this;
    let typeOfShape = typeof shape;
    if (typeOfThis !== typeOfShape) {
      return false;
    }
    return this._id === shape.id;
  }
};

// src/shape/Rectangle.ts
var Rectangle = class extends Shape {
  /**
   * @param topLeft  the upper‑left corner of the rectangle
   * @param width    must be > 0
   * @param height   must be > 0
   */
  constructor(topLeft, width, height) {
    const pts = [
      topLeft,
      new Point(topLeft.x + width, topLeft.y),
      // top‑right
      new Point(topLeft.x + width, topLeft.y + height),
      // bottom‑right
      new Point(topLeft.x, topLeft.y + height)
      // bottom‑left
    ];
    super(pts);
    this._width = 0;
    this._height = 0;
    if (width <= 0 || height <= 0) {
      throw new Error("Width and height must be greater than 0.");
    }
    this._width = width;
    this._height = height;
  }
  get topLeft() {
    return this._points[0];
  }
  get width() {
    return this._width;
  }
  set width(value) {
    this._width = value;
  }
  get height() {
    return this._height;
  }
  set height(value) {
    this._height = value;
  }
  contains(point) {
    const topLeft = this._points[0];
    return point.x >= topLeft.x && topLeft.x + this._width >= point.x && point.y >= topLeft.y && topLeft.y + this._height >= point.y;
  }
  getConnectablePoints() {
    const ret = new Array();
    const topLeft = this._points[0];
    ret.push(new Point(topLeft.x + this._width / 2, topLeft.y));
    ret.push(new Point(topLeft.x + this._width, topLeft.y + this._height / 2));
    ret.push(new Point(topLeft.x + this._width / 2, topLeft.y + this._height));
    ret.push(new Point(topLeft.x, topLeft.y + this._height / 2));
    return ret;
  }
};

// src/shape/Square.ts
var Square = class extends Rectangle {
  constructor(topLeft, side) {
    if (side <= 0) {
      throw new Error("Side length must be > 0.");
    }
    super(topLeft, side, side);
    this._side = 0;
    this._side = side;
  }
  get topLeft() {
    return this._points[0];
  }
  set topLeft(value) {
    this._points[0] = value;
  }
  get side() {
    return this._side;
  }
  set side(value) {
    this._side = value;
  }
  contains(point) {
    const topLeft = this._points[0];
    return point.x >= topLeft.x && topLeft.x + this._side >= point.x && point.y >= topLeft.y && topLeft.y + this._side >= point.y;
  }
  getConnectablePoints() {
    const ret = new Array();
    const topLeft = this._points[0];
    ret.push(new Point(topLeft.x + this._side / 2, topLeft.y));
    ret.push(new Point(topLeft.x + this._side, topLeft.y + this._side / 2));
    ret.push(new Point(topLeft.x + this._side / 2, topLeft.y + this._side));
    ret.push(new Point(topLeft.x, topLeft.y + this._side / 2));
    return ret;
  }
};

// src/shape/Circle.ts
var Circle = class extends Shape {
  constructor(center, radius) {
    const pts = [center];
    super(pts);
    this._radius = 0;
    if (radius < 0) {
      throw new RangeError("Radius must be \u2265 0");
    }
    this._radius = radius;
    this._center = center;
  }
  get radius() {
    return this._radius;
  }
  set radius(value) {
    this._radius = value;
  }
  get center() {
    return this._center;
  }
  set center(point) {
    this._center = point;
    this._points[0] = this._center;
  }
  get area() {
    return Math.PI * this._radius * this._radius;
  }
  // offset(point: Point): Point {
  //   const topLeft = new Point(this._center.x - this._radius, this._center.y - this._radius);
  //   return new Point(point.x - topLeft.x, point.y - topLeft.y);
  // }
  place(point) {
    this.center = point;
  }
  contains(point) {
    const dx = point.x - this._center.x;
    const dy = point.y - this._center.y;
    return dx * dx + dy * dy <= this._radius * this._radius;
  }
  getConnectablePoints() {
    const ret = new Array();
    ret.push(new Point(this._center.x, this._center.y - this._radius));
    ret.push(new Point(this._center.x + this._radius, this._center.y));
    ret.push(new Point(this._center.x, this._center.y + this._radius));
    ret.push(new Point(this._center.x - this._radius, this._center.y));
    return ret;
  }
};

// src/shape/Diamond.ts
var Diamond = class extends Shape {
  constructor(center, width, height) {
    const pts = [center];
    super(pts);
    this._center = center;
    this._width = width;
    this._height = height;
  }
  get center() {
    return this._center;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  place(point) {
    this._center = point;
    this._points[0] = point;
  }
  offset(point) {
    return new Point(point.x - this._center.x, point.y - this._center.y);
  }
  contains(point) {
    let result = this.containsForRightAngleTriangle(
      point,
      new Point(this._center.x - this._width / 2, this._center.y),
      new Point(this._center.x, this._center.y - this._height / 2)
    );
    if (result) {
      return result;
    }
    result = this.containsForRightAngleTriangle(
      point,
      new Point(this._center.x + this._width / 2, this._center.y),
      new Point(this._center.x, this._center.y - this._height / 2)
    );
    if (result) {
      return result;
    }
    result = this.containsForRightAngleTriangle(
      point,
      new Point(this._center.x - this._width / 2, this._center.y),
      new Point(this._center.x, this._center.y + this._height / 2)
    );
    if (result) {
      return result;
    }
    result = this.containsForRightAngleTriangle(
      point,
      new Point(this._center.x + this._width / 2, this._center.y),
      new Point(this._center.x, this._center.y + this._height / 2)
    );
    if (result) {
      return result;
    }
    return false;
  }
  containsForRightAngleTriangle(point, horizontal, vertical) {
    const v0 = { x: horizontal.x - this._center.x, y: horizontal.y - this._center.y };
    const v1 = { x: vertical.x - this._center.x, y: vertical.y - this._center.y };
    const v2 = { x: point.x - this._center.x, y: point.y - this._center.y };
    const dot00 = v0.x * v0.x + v0.y * v0.y;
    const dot01 = v0.x * v1.x + v0.y * v1.y;
    const dot02 = v0.x * v2.x + v0.y * v2.y;
    const dot11 = v1.x * v1.x + v1.y * v1.y;
    const dot12 = v1.x * v2.x + v1.y * v2.y;
    const denom = dot00 * dot11 - dot01 * dot01;
    if (denom === 0) return false;
    const invDenom = 1 / denom;
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    return u >= 0 && v >= 0 && u + v <= 1;
  }
  getConnectablePoints() {
    const ret = new Array();
    const center = this._points[0];
    ret.push(new Point(center.x, center.y - this._height / 2));
    ret.push(new Point(center.x + this._width / 2, center.y));
    ret.push(new Point(center.x, center.y + this._height / 2));
    ret.push(new Point(center.x - this._width / 2, center.y));
    return ret;
  }
};

// src/shape/Cloud.ts
var Cloud = class extends Shape {
  constructor(center, width, height) {
    if (width <= 0 || height <= 0) {
      throw new Error("Width and height must be greater than 0.");
    }
    super([center]);
    this._center = center;
    this._width = width;
    this._height = height;
  }
  get center() {
    return this._center;
  }
  set center(point) {
    this._center = point;
    this._points[0] = point;
  }
  get width() {
    return this._width;
  }
  set width(value) {
    this._width = value;
  }
  get height() {
    return this._height;
  }
  set height(value) {
    this._height = value;
  }
  /** Radius of each lobe (half the height). */
  get lobeRadius() {
    return this._height / 2;
  }
  /** Number of round lobes across the top. */
  get lobeCount() {
    return Math.max(3, Math.ceil(this._width / this._height));
  }
  /** Horizontal distance between adjacent lobe centers. */
  get lobeSpacing() {
    return Math.max(0, (this._width - this._height) / (this.lobeCount - 1));
  }
  /** X coordinate of the i-th lobe center. */
  lobeCenterX(i) {
    const left = this._center.x - this._width / 2;
    return left + this.lobeRadius + i * this.lobeSpacing;
  }
  place(point) {
    this.center = point;
  }
  offset(point) {
    return new Point(point.x - this._center.x, point.y - this._center.y);
  }
  contains(point) {
    const left = this._center.x - this._width / 2;
    const right = this._center.x + this._width / 2;
    const top = this._center.y - this._height / 2;
    const bottom = this._center.y + this._height / 2;
    if (point.x < left || point.x > right || point.y < top || point.y > bottom) {
      return false;
    }
    const R = this.lobeRadius;
    const d = this.lobeSpacing;
    const yoff = Math.sqrt(Math.max(0, R * R - d / 2 * (d / 2)));
    const cy = this._center.y;
    for (let i = 0; i < this.lobeCount; i++) {
      const dx = point.x - this.lobeCenterX(i);
      const dy = point.y - cy;
      if (dx * dx + dy * dy <= R * R) {
        return true;
      }
    }
    const fillLeft = left + R;
    const fillRight = right - R;
    return point.y >= cy + yoff && point.x >= fillLeft && point.x <= fillRight;
  }
  getConnectablePoints() {
    const ret = new Array();
    const c = this._center;
    ret.push(new Point(c.x, c.y - this._height / 2));
    ret.push(new Point(c.x + this._width / 2, c.y));
    ret.push(new Point(c.x, c.y + this._height / 2));
    ret.push(new Point(c.x - this._width / 2, c.y));
    return ret;
  }
};

// src/shape/Cylinder.ts
var Cylinder = class extends Shape {
  constructor(center, width, height) {
    if (width <= 0 || height <= 0) {
      throw new Error("Width and height must be greater than 0.");
    }
    super([center]);
    this._center = center;
    this._width = width;
    this._height = height;
  }
  get center() {
    return this._center;
  }
  set center(point) {
    this._center = point;
    this._points[0] = point;
  }
  get width() {
    return this._width;
  }
  set width(value) {
    this._width = value;
  }
  get height() {
    return this._height;
  }
  set height(value) {
    this._height = value;
  }
  /** Vertical radius of the elliptical caps. */
  get capRadius() {
    return Math.min(this._width * 0.18, this._height * 0.28);
  }
  place(point) {
    this.center = point;
  }
  offset(point) {
    return new Point(point.x - this._center.x, point.y - this._center.y);
  }
  contains(point) {
    const cx = this._center.x;
    const cy = this._center.y;
    const left = cx - this._width / 2;
    const right = cx + this._width / 2;
    const top = cy - this._height / 2;
    const bottom = cy + this._height / 2;
    if (point.x < left || point.x > right || point.y < top || point.y > bottom) {
      return false;
    }
    const rx = this._width / 2;
    const ry = this.capRadius;
    if (point.y >= top + ry && point.y <= bottom - ry) {
      return true;
    }
    const capY = point.y < cy ? top + ry : bottom - ry;
    const nx = (point.x - cx) / rx;
    const ny = (point.y - capY) / ry;
    return nx * nx + ny * ny <= 1;
  }
  getConnectablePoints() {
    const ret = new Array();
    const c = this._center;
    ret.push(new Point(c.x, c.y - this._height / 2));
    ret.push(new Point(c.x + this._width / 2, c.y));
    ret.push(new Point(c.x, c.y + this._height / 2));
    ret.push(new Point(c.x - this._width / 2, c.y));
    return ret;
  }
};

// src/shape/Group.ts
var Group = class extends Shape {
  constructor(shapes = []) {
    super([new Point(0, 0)]);
    this._shapes = [];
    this._width = 0;
    this._height = 0;
    this._padding = 20;
    this._title = "";
    this._shapes = [...shapes];
    this.recalculate();
  }
  get shapes() {
    return this._shapes;
  }
  get topLeft() {
    return this._points[0];
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get padding() {
    return this._padding;
  }
  set padding(value) {
    this._padding = value;
  }
  get title() {
    return this._title;
  }
  set title(value) {
    this._title = value;
  }
  add(shape) {
    this._shapes.push(shape);
    this.recalculate();
  }
  contains(point) {
    return this._shapes.some((shape) => shape.contains(point));
  }
  getConnectablePoints() {
    const topLeft = this._points[0];
    return [
      new Point(topLeft.x + this._width / 2, topLeft.y),
      new Point(topLeft.x + this._width, topLeft.y + this._height / 2),
      new Point(topLeft.x + this._width / 2, topLeft.y + this._height),
      new Point(topLeft.x, topLeft.y + this._height / 2)
    ];
  }
  move(dx, dy) {
    for (let i = 0; i < this._shapes.length; i++) {
      this._shapes[i].move(dx, dy);
    }
    super.move(dx, dy);
  }
  place(point) {
    const anchor = this._points[0];
    this.move(point.x - anchor.x, point.y - anchor.y);
  }
  /**
   * Recomputes the bounding box (top‑left, width and height) from the union of
   * every child’s connectable points, which mark each shape’s outer extents.
   */
  recalculate() {
    if (this._shapes.length === 0) {
      this._points[0] = new Point(0, 0);
      this._width = 0;
      this._height = 0;
      return;
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < this._shapes.length; i++) {
      const points = this._shapes[i].getConnectablePoints();
      for (let j = 0; j < points.length; j++) {
        const p = points[j];
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
    }
    this._points[0] = new Point(minX, minY);
    this._width = maxX - minX;
    this._height = maxY - minY;
  }
};

// src/shape/Connection.ts
var _Connection = class _Connection {
  constructor(source, target) {
    this._label = "";
    this._color = "black";
    this._beam = false;
    this._source = source;
    this._target = target;
  }
  get source() {
    return this._source;
  }
  get target() {
    return this._target;
  }
  get label() {
    return this._label;
  }
  set label(label) {
    this._label = label;
  }
  get color() {
    return this._color;
  }
  set color(color) {
    this._color = color;
  }
  get beam() {
    return this._beam;
  }
  set beam(beam) {
    this._beam = beam;
  }
  render(ctx, dashOffset = 0) {
    let srcPts = this._source.getConnectablePoints();
    let tgtPts = this._target.getConnectablePoints();
    let srcIdx = -1;
    let tgtIdx = -1;
    let min = Infinity;
    let pair = [new Point(0, 0), new Point(0, 0)];
    for (let i = 0; i < srcPts.length; i++) {
      for (let j = 0; j < tgtPts.length; j++) {
        let dist = srcPts[i].distanceTo(tgtPts[j]);
        if (dist < min) {
          pair[0] = srcPts[i];
          pair[1] = tgtPts[j];
          srcIdx = i;
          tgtIdx = j;
          min = dist;
        }
      }
    }
    const size = 10;
    let angle = 90;
    let offsetX = 0;
    let offsetY = 0;
    for (let i = 0; i < tgtPts.length; i++) {
      if (tgtPts[i].equals(pair[1])) {
        if (i == 0) {
          angle = 180;
          offsetY = -size;
        } else if (i == 1) {
          angle = 270;
          offsetX = size;
        } else if (i == 2) {
          angle = 0;
          offsetY = size;
        } else if (i == 3) {
          angle = 90;
          offsetX = -size;
        }
        break;
      }
    }
    if (min !== Infinity) {
      ctx.beginPath();
      if (srcIdx % 2 == tgtIdx % 2) {
        const middle = new Point((pair[0].x + pair[1].x) / 2, (pair[0].y + pair[1].y) / 2);
        if (srcIdx % 2 == 0) {
          ctx.moveTo(pair[0].x, pair[0].y);
          ctx.lineTo(pair[0].x, middle.y);
          ctx.lineTo(pair[1].x + offsetX, middle.y);
          ctx.lineTo(pair[1].x + offsetX, pair[1].y + offsetY);
        } else {
          ctx.moveTo(pair[0].x, pair[0].y);
          ctx.lineTo(middle.x, pair[0].y);
          ctx.lineTo(middle.x, pair[1].y + offsetY);
          ctx.lineTo(pair[1].x + offsetX, pair[1].y + offsetY);
        }
      } else if (srcIdx % 2 == 0 && tgtIdx % 2 == 1) {
        const corner = new Point(pair[0].x, pair[1].y);
        ctx.moveTo(pair[0].x, pair[0].y);
        ctx.lineTo(corner.x, corner.y + offsetY);
        ctx.lineTo(pair[1].x + offsetX, pair[1].y + offsetY);
      } else if (srcIdx % 2 == 1 && tgtIdx % 2 == 0) {
        const corner = new Point(pair[1].x, pair[0].y - offsetY);
        ctx.moveTo(pair[0].x, pair[0].y);
        ctx.lineTo(corner.x, corner.y + offsetY);
        ctx.lineTo(pair[1].x + offsetX, pair[1].y + offsetY);
      }
      ctx.lineWidth = _Connection.LINE_WIDTH;
      ctx.strokeStyle = this._color;
      ctx.stroke();
      if (this._beam) {
        ctx.save();
        ctx.lineWidth = _Connection.LINE_WIDTH;
        ctx.strokeStyle = _Connection.BEAM_COLOR;
        ctx.shadowColor = _Connection.BEAM_COLOR;
        ctx.shadowBlur = 10;
        ctx.setLineDash([10, 14]);
        ctx.lineDashOffset = -dashOffset;
        ctx.stroke();
        ctx.restore();
      }
    }
    this.renderArrowHead(ctx, pair[1].x, pair[1].y, angle, size);
  }
  renderArrowHead(ctx, x, y, angle, size = 15) {
    ctx.fillStyle = this._color;
    const offset = _Connection.LINE_WIDTH / 2;
    ctx.beginPath();
    if (angle == 0) {
      x += offset;
      ctx.moveTo(x, y);
      ctx.lineTo(x - size / 2, y + size);
      ctx.lineTo(x + size / 2, y + size);
      ctx.moveTo(x, y);
    } else if (angle == 90) {
      y += offset;
      ctx.moveTo(x, y);
      ctx.lineTo(x - size, y - size / 2);
      ctx.lineTo(x - size, y + size / 2);
      ctx.moveTo(x, y);
    } else if (angle == 180) {
      x += offset;
      ctx.moveTo(x, y);
      ctx.lineTo(x - size / 2, y - size);
      ctx.lineTo(x + size / 2, y - size);
      ctx.moveTo(x, y);
    } else if (angle == 270) {
      y += offset;
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y - size / 2);
      ctx.lineTo(x + size, y + size / 2);
      ctx.moveTo(x, y);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
  }
  renderCornerLine(ctx, source, target, offsetX, offsetY) {
  }
  renderDirectLine(ctx, source, target, offsetX, offsetY) {
  }
};
_Connection.LINE_WIDTH = 2;
_Connection.BEAM_COLOR = "#67e8f9";
var Connection = _Connection;

// src/renderer/ShapeRenderer.ts
var ShapeRenderer = class {
  /**
   * Draws a rectangle with the same radius on all four corners.
   * Works in all browsers that support CanvasRenderingContext2D.
   */
  static renderRoundedRect(ctx, x, y, width, height, borderRadius, borderWidth, borderColor, backgroundColor) {
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor.hex;
    }
    ctx.strokeStyle = borderColor.hex;
    ctx.lineWidth = borderWidth;
    ctx.beginPath();
    ctx.moveTo(x + borderRadius, y);
    ctx.lineTo(x + width - borderRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
    ctx.lineTo(x + width, y + height - borderRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
    ctx.lineTo(x + borderRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
    ctx.lineTo(x, y + borderRadius);
    ctx.quadraticCurveTo(x, y, x + borderRadius, y);
    ctx.closePath();
    if (backgroundColor) {
      ctx.fill();
    }
    ctx.stroke();
  }
};

// src/renderer/CircleRenderer.ts
var CircleRenderer = class extends ShapeRenderer {
  render(ctx, shape) {
    const circle = shape;
    ctx.beginPath();
    ctx.arc(circle.center.x, circle.center.y, circle.radius, 0, Math.PI * 2);
    ctx.closePath();
    if (circle.backgroundColor) {
      ctx.fillStyle = circle.backgroundColor.hex;
      ctx.fill();
    }
    if (circle.borderWidth > 0) {
      ctx.lineWidth = circle.borderWidth;
      ctx.strokeStyle = circle.borderColor.hex;
      ctx.stroke();
    } else {
      if (circle.backgroundColor) {
        ctx.strokeStyle = circle.backgroundColor.hex;
        ctx.stroke();
      }
    }
    if (shape.text != "") {
      ctx.fillStyle = shape.foregroundColor.hex;
      const center = circle.center;
      const metrics = ctx.measureText(shape.text);
      const width = metrics.width;
      const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      ctx.fillText(
        shape.text,
        center.x - width / 2,
        center.y + height / 2
      );
    }
  }
};

// src/renderer/SquareRenderer.ts
var SquareRenderer = class extends ShapeRenderer {
  render(ctx, shape) {
    const square = shape;
    if (square.borderRadius == 0) {
      ctx.strokeStyle = square.borderColor.hex;
      ctx.lineWidth = square.borderWidth;
      if (square.backgroundColor) {
        ctx.fillStyle = square.backgroundColor.hex;
        ctx.fillRect(square.topLeft.x, square.topLeft.y, square.side, square.side);
      }
      ctx.strokeRect(square.topLeft.x, square.topLeft.y, square.side, square.side);
    } else {
      ShapeRenderer.renderRoundedRect(
        ctx,
        square.topLeft.x,
        square.topLeft.y,
        square.side,
        square.side,
        square.borderRadius,
        square.borderWidth,
        square.borderColor,
        square.backgroundColor
      );
    }
    if (shape.text != "") {
      ctx.fillStyle = shape.foregroundColor.hex;
      const metrics = ctx.measureText(shape.text);
      const width = metrics.width;
      const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      ctx.fillText(
        shape.text,
        square.topLeft.x + (square.width - width) / 2,
        square.topLeft.y + (square.height + height) / 2
      );
    }
  }
};

// src/renderer/DiamondRenderer.ts
var DiamondRenderer = class extends ShapeRenderer {
  render(ctx, shape) {
    const diamond = shape;
    const top = new Point(diamond.center.x, diamond.center.y - diamond.height / 2);
    const right = new Point(diamond.center.x + diamond.width / 2, diamond.center.y);
    const bottom = new Point(diamond.center.x, diamond.center.y + diamond.height / 2);
    const left = new Point(diamond.center.x - diamond.width / 2, diamond.center.y);
    ctx.strokeStyle = diamond.borderColor.hex;
    ctx.lineWidth = diamond.borderWidth;
    if (diamond.backgroundColor) {
      ctx.fillStyle = diamond.backgroundColor.hex;
    }
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(right.x, right.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.lineTo(left.x, left.y);
    ctx.lineTo(top.x, top.y);
    ctx.closePath();
    ctx.fill("nonzero");
    ctx.stroke();
    if (shape.text != "") {
      ctx.fillStyle = shape.foregroundColor.hex;
      const metrics = ctx.measureText(shape.text);
      const width = metrics.width;
      const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      ctx.fillText(
        shape.text,
        left.x + (diamond.width - width) / 2,
        top.y + (diamond.height + height) / 2
      );
    }
  }
};

// src/renderer/RectangleRenderer.ts
var RectangleRenderer = class extends ShapeRenderer {
  render(ctx, shape) {
    const rect = shape;
    if (rect.borderRadius == 0) {
      ctx.strokeStyle = rect.borderColor.hex;
      ctx.lineWidth = rect.borderWidth;
      if (rect.backgroundColor) {
        ctx.fillStyle = rect.backgroundColor.hex;
        ctx.fillRect(rect.topLeft.x, rect.topLeft.y, rect.width, rect.height);
      }
      ctx.strokeRect(rect.topLeft.x, rect.topLeft.y, rect.width, rect.height);
    } else {
      ShapeRenderer.renderRoundedRect(
        ctx,
        rect.topLeft.x,
        rect.topLeft.y,
        rect.width,
        rect.height,
        rect.borderRadius,
        rect.borderWidth,
        rect.borderColor,
        rect.backgroundColor
      );
    }
    if (shape.text != "") {
      ctx.fillStyle = shape.foregroundColor.hex;
      const metrics = ctx.measureText(shape.text);
      const width = metrics.width;
      const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      ctx.fillText(
        shape.text,
        rect.topLeft.x + (rect.width - width) / 2,
        rect.topLeft.y + (rect.height + height) / 2
      );
    }
  }
};

// src/renderer/CloudRenderer.ts
var CloudRenderer = class extends ShapeRenderer {
  render(ctx, shape) {
    const cloud = shape;
    const cx = cloud.center.x;
    const cy = cloud.center.y;
    const w = cloud.width;
    const h = cloud.height || w * 0.74;
    const x = cx - w / 2;
    const y = cy - h / 2;
    if (cloud.backgroundColor) {
      ctx.save();
      ctx.translate(0, 6);
      this.defineCloudPath(ctx, x, y, w, h);
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fill();
      ctx.restore();
    }
    this.defineCloudPath(ctx, x, y, w, h);
    if (cloud.backgroundColor) {
      ctx.fillStyle = cloud.backgroundColor.hex;
      ctx.fill();
    }
    if (cloud.borderWidth > 0) {
      ctx.lineWidth = cloud.borderWidth;
      ctx.strokeStyle = cloud.borderColor.hex;
      ctx.stroke();
    } else if (cloud.backgroundColor) {
      ctx.strokeStyle = cloud.backgroundColor.hex;
      ctx.stroke();
    }
    if (shape.text != "") {
      ctx.save();
      ctx.fillStyle = shape.foregroundColor.hex;
      const textX = cx - w * 0.06;
      const textY = cy + h * 0.12;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(shape.text, textX, textY);
      ctx.restore();
    }
  }
  /**
   * 完美无缝契合包围盒 [x, x+w] 的云朵路径定义，彻底消除左右侧箭头的所有多余空隙
   */
  defineCloudPath(ctx, x, y, w, h) {
    const baseY = y + 0.85 * h;
    ctx.beginPath();
    ctx.moveTo(x + 0.15 * w, baseY);
    ctx.bezierCurveTo(
      x + 0.06 * w,
      baseY + 0.05 * h,
      x - 0.06 * w,
      y + 0.65 * h,
      x + 0.08 * w,
      y + 0.54 * h
    );
    ctx.bezierCurveTo(
      x + 0.04 * w,
      y + 0.34 * h,
      x + 0.2 * w,
      y + 0.28 * h,
      x + 0.26 * w,
      y + 0.38 * h
    );
    ctx.bezierCurveTo(
      x + 0.3 * w,
      y + 0.1 * h,
      x + 0.48 * w,
      y + 0.1 * h,
      x + 0.52 * w,
      y + 0.35 * h
    );
    ctx.bezierCurveTo(
      x + 0.58 * w,
      y + 0.24 * h,
      x + 0.84 * w,
      y + 0.28 * h,
      x + 0.88 * w,
      y + 0.48 * h
    );
    ctx.bezierCurveTo(
      x + 1.08 * w,
      y + 0.6 * h,
      x + 1 * w,
      baseY + 0.05 * h,
      x + 0.88 * w,
      baseY
    );
    ctx.lineTo(x + 0.15 * w, baseY);
    ctx.closePath();
  }
};

// src/renderer/CylinderRenderer.ts
var CylinderRenderer = class extends ShapeRenderer {
  render(ctx, shape) {
    const cyl = shape;
    const cx = cyl.center.x;
    const cy = cyl.center.y;
    const rx = cyl.width / 2;
    const ry = cyl.capRadius;
    const left = cx - rx;
    const right = cx + rx;
    const top = cy - cyl.height / 2;
    const bottom = cy + cyl.height / 2;
    ctx.beginPath();
    ctx.moveTo(right, top + ry);
    ctx.lineTo(right, bottom - ry);
    ctx.ellipse(cx, bottom - ry, rx, ry, 0, 0, Math.PI);
    ctx.lineTo(left, top + ry);
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
    if (shape.text != "") {
      ctx.fillStyle = shape.foregroundColor.hex;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(shape.text, cx, cy + cyl.height * 0.28);
    }
  }
};

// src/paint/FlatPlayground.ts
var _FlatPlayground = class _FlatPlayground {
  constructor(ctx, width, height) {
    this._width = 0;
    this._height = 0;
    this._shapes = [];
    this._connections = [];
    this._dashOffset = 0;
    this._animationId = null;
    this._ctx = ctx;
    this._width = width;
    this._height = height;
  }
  render() {
    this._ctx.clearRect(0, 0, this._width, this._height);
    this.drawBackground();
    const shapes = this._shapes.sort((a, b) => a.depth - a.depth);
    for (let i = 0; i < shapes.length; i++) {
      this.renderShape(shapes[i]);
    }
    for (let i = 0; i < this._connections.length; i++) {
      this._connections[i].color = "#888";
      this._connections[i].render(this._ctx, this._dashOffset);
    }
  }
  /**
   * Starts a requestAnimationFrame loop that advances the beam dash offset and
   * re-renders, so {@link Connection} beams appear to flow. No-op if already
   * running.
   */
  startBeamAnimation() {
    if (this._animationId != null) {
      return;
    }
    const tick = () => {
      this._dashOffset = (this._dashOffset + 0.3) % 24;
      this.render();
      this._animationId = requestAnimationFrame(tick);
    };
    this._animationId = requestAnimationFrame(tick);
  }
  /**
   * Renders a single shape, recursing into {@link Group} children and drawing
   * a dashed frame around the group’s bounding box.
   */
  renderShape(shape) {
    if (shape instanceof Group) {
      for (let i = 0; i < shape.shapes.length; i++) {
        this.renderShape(shape.shapes[i]);
      }
      this.renderGroupFrame(shape);
      return;
    }
    if (shape instanceof Circle) {
      _FlatPlayground.CIRCLE_RENDERER.render(this._ctx, shape);
    } else if (shape instanceof Square) {
      _FlatPlayground.SQUARE_RENDERER.render(this._ctx, shape);
    } else if (shape instanceof Rectangle) {
      _FlatPlayground.RECTANGLE_RENDERER.render(this._ctx, shape);
    } else if (shape instanceof Diamond) {
      _FlatPlayground.DIAMOND_RENDERER.render(this._ctx, shape);
    } else if (shape instanceof Cloud) {
      _FlatPlayground.CLOUD_RENDERER.render(this._ctx, shape);
    } else if (shape instanceof Cylinder) {
      _FlatPlayground.CYLINDER_RENDERER.render(this._ctx, shape);
    }
  }
  /**
   * Draws the dashed frame around a group’s children, padded outward from the
   * bounding box and with rounded corners. A title bar is reserved at the top.
   */
  renderGroupFrame(group) {
    const pad = group.padding;
    const titleH = 16;
    const titleGap = 8;
    const x = group.topLeft.x - pad;
    const y = group.topLeft.y - pad - titleH - titleGap;
    const w = group.width + pad * 2;
    const h = group.height + pad * 2 + titleH + titleGap;
    const r = Math.min(12, w / 2, h / 2);
    const ctx = this._ctx;
    ctx.save();
    ctx.setLineDash([10, 6]);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.stroke();
    if (group.title != "") {
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(group.title, x + pad, y + pad + titleH / 2);
    }
    ctx.restore();
  }
  select(x, y) {
    let retVal = null;
    const p = new Point(x, y);
    for (let i = 0; i < this._shapes.length; i++) {
    }
    for (let i = 0; i < this._shapes.length; i++) {
      if (this._shapes[i].contains(p)) {
        retVal = this._shapes[i];
      }
    }
    this.render();
    return retVal;
  }
  addShape(shape) {
    this._shapes.push(shape);
    this.render();
  }
  shiftShape(shape, mousepos, offset) {
    shape.place(new Point(mousepos.x - offset.x, mousepos.y - offset.y));
    this.render();
  }
  drawBackground({
    dotRadius = 1,
    spacing = 20,
    dotColor = "#333",
    background = "#0b1220"
  } = {}) {
    const ctx = this._ctx;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, this._width, this._height);
    const cols = Math.ceil(this._width / spacing);
    const rows = Math.ceil(this._height / spacing);
    ctx.fillStyle = dotColor;
    for (let y = 0; y < rows; ++y) {
      for (let x = 0; x < cols; ++x) {
        const cx = x * spacing + spacing / 2;
        const cy = y * spacing + spacing / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  drawArrowHead(x, y, angle, size = 15) {
    this._ctx.save();
    this._ctx.translate(x, y);
    this._ctx.rotate(angle);
    this._ctx.fillStyle = "red";
    this._ctx.beginPath();
    this._ctx.moveTo(0, 0);
    this._ctx.lineTo(-size, -size / 2);
    this._ctx.lineTo(-size, size / 2);
    this._ctx.closePath();
    this._ctx.fill();
    this._ctx.restore();
  }
  drawQuadraticCurveWithArrow(startPoint, endPoint, controlOffset = 100) {
    const midX = (startPoint.x + endPoint.x) / 2;
    const midY = (startPoint.y + endPoint.y) / 2;
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const controlX = midX - dy / length * controlOffset;
    const controlY = midY + dx / length * controlOffset;
    this._ctx.strokeStyle = "#e74c3c";
    this._ctx.lineWidth = 3;
    this._ctx.beginPath();
    this._ctx.moveTo(startPoint.x, startPoint.y);
    this._ctx.quadraticCurveTo(controlX, controlY, endPoint.x, endPoint.y);
    this._ctx.stroke();
    const t = 0.9;
    const arrowX = (1 - t) * (1 - t) * startPoint.x + 2 * (1 - t) * t * controlX + t * t * endPoint.x;
    const arrowY = (1 - t) * (1 - t) * startPoint.y + 2 * (1 - t) * t * controlY + t * t * endPoint.y;
    const tangentX = 2 * (1 - t) * (controlX - startPoint.x) + 2 * t * (endPoint.x - controlX);
    const tangentY = 2 * (1 - t) * (controlY - startPoint.y) + 2 * t * (endPoint.y - controlY);
    const angle = Math.atan2(tangentY, tangentX);
    this.drawArrowHead(arrowX, arrowY, 90);
  }
  addConnection(startPoint, endPoint, cp1Offset = 50, cp2Offset = 50) {
    const cp1x = startPoint.x + cp1Offset;
    const cp1y = startPoint.y - cp1Offset;
    const cp2x = endPoint.x - cp2Offset;
    const cp2y = endPoint.y - cp2Offset;
    this._ctx.strokeStyle = "#9b59b6";
    this._ctx.lineWidth = 3;
    this._ctx.beginPath();
    this._ctx.moveTo(startPoint.x, startPoint.y);
    this._ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endPoint.x, endPoint.y);
    this._ctx.stroke();
    const tangentX = 3 * (endPoint.x - cp2x);
    const tangentY = 3 * (endPoint.y - cp2y);
    const angle = Math.atan2(tangentY, tangentX);
    this.drawArrowHead(endPoint.x, endPoint.y, 90);
  }
  connect(source, target) {
    const conn = new Connection(source, target);
    for (let cn of this._connections) {
    }
    this._connections.push(conn);
    this.render();
  }
  getShapes() {
    return this._shapes;
  }
  getConnections() {
    return this._connections;
  }
};
_FlatPlayground.CIRCLE_RENDERER = new CircleRenderer();
_FlatPlayground.SQUARE_RENDERER = new SquareRenderer();
_FlatPlayground.RECTANGLE_RENDERER = new RectangleRenderer();
_FlatPlayground.DIAMOND_RENDERER = new DiamondRenderer();
_FlatPlayground.CLOUD_RENDERER = new CloudRenderer();
_FlatPlayground.CYLINDER_RENDERER = new CylinderRenderer();
var FlatPlayground = _FlatPlayground;

// src/dot/Dot.ts
var Dot = class {
  static parse(text) {
    const statements = this.tokenize(this.extractBody(text));
    const nodeDefs = /* @__PURE__ */ new Map();
    const edgePairs = [];
    for (const stmt of statements) {
      if (stmt.indexOf("->") !== -1 || stmt === "{" || stmt === "}") continue;
      if (/^(digraph|graph|subgraph)\b/.test(stmt)) continue;
      const m = stmt.match(/^([A-Za-z0-9_一-龥]+)\s*(?:\[(.*)\])?$/);
      if (m) {
        nodeDefs.set(m[1], this.parseAttrs(m[2] ? "[" + m[2] + "]" : ""));
      }
    }
    for (const stmt of statements) {
      if (stmt.indexOf("->") === -1) continue;
      const ids = this.stripAttrs(stmt).split("->").map((s) => s.trim()).filter((s) => s !== "");
      for (let i = 0; i < ids.length - 1; i++) {
        edgePairs.push([ids[i], ids[i + 1]]);
      }
    }
    for (const [from, to] of edgePairs) {
      if (!nodeDefs.has(from)) nodeDefs.set(from, { label: from });
      if (!nodeDefs.has(to)) nodeDefs.set(to, { label: to });
    }
    const shapeById = /* @__PURE__ */ new Map();
    const groups = /* @__PURE__ */ new Map();
    const shapes = [];
    for (const [id, attrs] of nodeDefs) {
      const shape = this.createShape(id, attrs);
      shapeById.set(id, shape);
      const g = attrs.group;
      if (g !== void 0 && g !== "") {
        if (!groups.has(g)) groups.set(g, []);
        groups.get(g).push(shape);
      } else {
        shapes.push(shape);
      }
    }
    for (const [g, members] of groups) {
      const group = new Group(members);
      group.id = g;
      group.title = g;
      shapes.push(group);
    }
    const edges = [];
    for (const [from, to] of edgePairs) {
      const a = shapeById.get(from);
      const b = shapeById.get(to);
      if (a && b) edges.push({ from: a, to: b });
    }
    return { shapes, edges };
  }
  static extractBody(text) {
    const open = text.indexOf("{");
    const close = text.lastIndexOf("}");
    if (open !== -1 && close > open) {
      return text.slice(open + 1, close);
    }
    return text;
  }
  static tokenize(body) {
    return body.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "").split(/[;\n]/).map((s) => s.trim()).filter((s) => s.length > 0);
  }
  static stripAttrs(stmt) {
    const idx = stmt.indexOf("[");
    return idx === -1 ? stmt : stmt.slice(0, idx);
  }
  static parseAttrs(s) {
    const attrs = {};
    const m = s.match(/\[(.*)\]/);
    if (!m) return attrs;
    for (const part of m[1].split(",")) {
      const eq = part.indexOf("=");
      if (eq === -1) continue;
      const key = part.slice(0, eq).trim();
      let val = part.slice(eq + 1).trim();
      if (val.startsWith('"') && val.endsWith('"') || val.startsWith("'") && val.endsWith("'")) {
        val = val.slice(1, -1);
      }
      attrs[key] = val;
    }
    return attrs;
  }
  static createShape(id, attrs) {
    const label = attrs.label !== void 0 ? attrs.label : id;
    const type = (attrs.shape || "box").toLowerCase();
    const x = this.toNumber(attrs.x, 0);
    const y = this.toNumber(attrs.y, 0);
    const z = this.toNumber(attrs.z, 0);
    const fill = this.toColor(attrs.fillcolor, Color.from("#38bdf866"));
    const border = this.toColor(attrs.color, Color.from("#38bdf8"));
    let shape;
    switch (type) {
      case "circle":
      case "ellipse": {
        const r = this.toNumber(attrs.r, 32);
        shape = new Circle(new Point(x, y, z), r);
        break;
      }
      case "square": {
        const side = this.toNumber(attrs.w, this.toNumber(attrs.side, 64));
        shape = new Square(new Point(x, y, z), side);
        break;
      }
      case "diamond": {
        const w = this.toNumber(attrs.w, 110);
        const h = this.toNumber(attrs.h, 56);
        shape = new Diamond(new Point(x, y, z), w, h);
        break;
      }
      case "cloud": {
        const w = this.toNumber(attrs.w, 140);
        const h = this.toNumber(attrs.h, 60);
        shape = new Cloud(new Point(x, y, z), w, h);
        break;
      }
      case "cylinder": {
        const w = this.toNumber(attrs.w, 120);
        const h = this.toNumber(attrs.h, 60);
        shape = new Cylinder(new Point(x, y, z), w, h);
        break;
      }
      case "box":
      case "rect":
      case "rectangle":
      default: {
        const w = this.toNumber(attrs.w, 140);
        const h = this.toNumber(attrs.h, 56);
        shape = new Rectangle(new Point(x, y, z), w, h);
        break;
      }
    }
    shape.id = id;
    shape.text = label;
    shape.backgroundColor = fill;
    shape.borderColor = border;
    shape.borderWidth = 2;
    shape.foregroundColor = Color.white;
    shape.borderRadius = 10;
    return shape;
  }
  static toNumber(value, fallback) {
    if (value === void 0) return fallback;
    const n = parseFloat(value);
    return isNaN(n) ? fallback : n;
  }
  static toColor(value, fallback) {
    if (!value) return fallback;
    try {
      return Color.from(value);
    } catch (e) {
      return fallback;
    }
  }
};
Dot.VERSION = "1.0.0";
//# sourceMappingURL=paint-shapes.js.map
