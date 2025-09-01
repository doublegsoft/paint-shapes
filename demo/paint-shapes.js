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
    this._alpha = alpha || 0;
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
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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
    this._borderRadius = 0;
    this._foregroundColor = Color.black;
    this._backgroundColor = Color.transparent;
    this._borderColor = Color.transparent;
    this._borderWidth = 2;
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
   * Gets offset relative to the top-left point according to the given point.
   */
  offset(point) {
    const topLeft2 = this._points[0];
    return new Point(point.x - topLeft2.x, point.y - topLeft2.y);
  }
};

// src/shape/Rectangle.ts
var Rectangle = class _Rectangle extends Shape {
  /**
   * @param topLeft  the upper‑left corner of the rectangle
   * @param width    must be > 0
   * @param height   must be > 0
   */
  constructor(_topLeft, width, height) {
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
    this._topLeft = _topLeft;
    this.width = width;
    this.height = height;
    if (width <= 0 || height <= 0) {
      throw new Error("Width and height must be greater than 0.");
    }
  }
  get topLeft() {
    return this._topLeft;
  }
  cloneWithPoints(newPoints) {
    return new _Rectangle(newPoints[0], this.width, this.height);
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.topLeft.x, this.topLeft.y, this.width, this.height);
    ctx.fill();
    ctx.stroke();
  }
  contains(point) {
    throw new Error("Method not implemented.");
  }
};

// src/shape/Square.ts
var Square = class extends Rectangle {
  constructor(topLeft2, side) {
    if (side <= 0) {
      throw new Error("Side length must be > 0.");
    }
    super(topLeft2, side, side);
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
    throw new Error("Method not implemented.");
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
  offset(point) {
    const topLeft2 = new Point(this._center.x - this._radius, this._center.y - this._radius);
    return new Point(point.x - topLeft2.x, point.y - topLeft2.y);
  }
  contains(point) {
    const dx = point.x - this._center.x;
    const dy = point.y - this._center.y;
    return dx * dx + dy * dy <= this._radius * this._radius;
  }
};

// src/renderer/ShapeRenderer.ts
var ShapeRenderer = class {
  /**
   * Draws a rectangle with the same radius on all four corners.
   * Works in all browsers that support CanvasRenderingContext2D.
   */
  static renderRoundedRect(ctx, x, y, width, height, borderRadius, borderWidth, borderColor, backgroundColor) {
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
      ctx.fillStyle = backgroundColor.hex;
    }
    ctx.strokeStyle = borderColor.hex;
    ctx.lineWidth = borderWidth;
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
    if (circle.borderWidth > 0) {
      ctx.lineWidth = circle.borderWidth;
      ctx.strokeStyle = circle.borderColor.hex;
      ctx.stroke();
    }
    if (circle.backgroundColor) {
      ctx.fillStyle = circle.backgroundColor.hex;
      ctx.fill();
    }
  }
};

// src/renderer/SquareRenderer.ts
var SquareRenderer = class extends ShapeRenderer {
  render(ctx, shape) {
    const square = shape;
    if (square.borderRadius > 0) {
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
  }
};

// src/paint/FlatPlayground.ts
var _FlatPlayground = class _FlatPlayground {
  constructor(ctx) {
    this._width = 0;
    this._height = 0;
    this._shapes = [];
    this._ctx = ctx;
  }
  render() {
    this._ctx.clearRect(0, 0, this._width, this._height);
    const shapes = this._shapes.sort((a, b) => a.depth - a.depth);
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      if (shape instanceof Circle) {
        _FlatPlayground.CIRCLE_RENDERER.render(this._ctx, shape);
      } else if (shape instanceof Square) {
        _FlatPlayground.SQUARE_RENDERER.render(this._ctx, shape);
      }
    }
  }
  addShape(shape) {
    this._shapes.push(shape);
    this.render();
  }
};
_FlatPlayground.CIRCLE_RENDERER = new CircleRenderer();
_FlatPlayground.SQUARE_RENDERER = new SquareRenderer();
var FlatPlayground = _FlatPlayground;
//# sourceMappingURL=paint-shapes.js.map
