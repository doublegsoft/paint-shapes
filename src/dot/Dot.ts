/*
** ████████████████████████████████████████████████████████████████████████
** █▄─▄▄─██▀▄─██▄─▄█▄─▀█▄─▄█─▄─▄─█▀▀▀▀▀██─▄▄▄▄█─█─██▀▄─██▄─▄▄─█▄─▄▄─█─▄▄▄▄█
** ██─▄▄▄██─▀─███─███─█▄▀─████─██████████▄▄▄▄─█─▄─██─▀─███─▄▄▄██─▄█▀█▄▄▄▄─█
** ▀▄▄▄▀▀▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▀▄▄▄▀▀▀▀▀▀▀▀▀▄▄▄▄▄▀▄▀▄▀▄▄▀▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀
*/

import {Shape} from "@/shape/Shape";
import {Circle} from "@/shape/Circle";
import {Square} from "@/shape/Square";
import {Diamond} from "@/shape/Diamond";
import {Rectangle} from "@/shape/Rectangle";
import {Cloud} from "@/shape/Cloud";
import {Cylinder} from "@/shape/Cylinder";
import {Group} from "@/shape/Group";
import {Point} from "@/common/Point";
import {Color} from "@/common/Color";

export interface DotEdge {
  from: Shape;
  to: Shape;
}

/**
 * A minimal Graphviz DOT parser. Turns a DOT description into shapes and
 * edges, positioned by the custom `x`, `y`, `z` attributes on each node
 * (no auto‑layout).
 *
 * Supported subset:
 *   digraph name { ... }
 *   id [label="...", shape=circle|square|diamond|box, x=..., y=..., z=...,
 *       color="#...", fillcolor="#...", r/w/h=...];
 *   a -> b;   (also chains: a -> b -> c)
 */
export class Dot {

  public static readonly VERSION: string = '1.0.0';

  static parse(text: string): { shapes: Shape[]; edges: DotEdge[] } {
    const statements = this.tokenize(this.extractBody(text));

    const nodeDefs = new Map<string, Record<string, string>>();
    const edgePairs: Array<[string, string]> = [];

    // 第一遍：收集节点定义
    for (const stmt of statements) {
      if (stmt.indexOf('->') !== -1 || stmt === '{' || stmt === '}') continue;
      if (/^(digraph|graph|subgraph)\b/.test(stmt)) continue;
      const m = stmt.match(/^([A-Za-z0-9_一-龥]+)\s*(?:\[(.*)\])?$/);
      if (m) {
        nodeDefs.set(m[1], this.parseAttrs(m[2] ? '[' + m[2] + ']' : ''));
      }
    }

    // 第二遍：收集边
    for (const stmt of statements) {
      if (stmt.indexOf('->') === -1) continue;
      const ids = this.stripAttrs(stmt).split('->').map(s => s.trim()).filter(s => s !== '');
      for (let i = 0; i < ids.length - 1; i++) {
        edgePairs.push([ids[i], ids[i + 1]]);
      }
    }

    // 边里出现但未声明的节点，补默认定义
    for (const [from, to] of edgePairs) {
      if (!nodeDefs.has(from)) nodeDefs.set(from, { label: from });
      if (!nodeDefs.has(to)) nodeDefs.set(to, { label: to });
    }

    const shapeById = new Map<string, Shape>();
    const groups = new Map<string, Shape[]>();
    const shapes: Shape[] = [];
    for (const [id, attrs] of nodeDefs) {
      const shape = this.createShape(id, attrs);
      shapeById.set(id, shape);
      const g = attrs.group;
      if (g !== undefined && g !== '') {
        if (!groups.has(g)) groups.set(g, []);
        groups.get(g)!.push(shape);
      } else {
        shapes.push(shape);
      }
    }

    // 相同 group 属性的节点归入同一个 Group
    for (const [g, members] of groups) {
      const group = new Group(members);
      group.id = g;
      group.title = g;
      shapes.push(group);
    }

    const edges: DotEdge[] = [];
    for (const [from, to] of edgePairs) {
      const a = shapeById.get(from);
      const b = shapeById.get(to);
      if (a && b) edges.push({ from: a, to: b });
    }

    return { shapes, edges };
  }

  private static extractBody(text: string): string {
    const open = text.indexOf('{');
    const close = text.lastIndexOf('}');
    if (open !== -1 && close > open) {
      return text.slice(open + 1, close);
    }
    return text;
  }

  private static tokenize(body: string): string[] {
    return body
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/[^\n]*/g, '')
      .split(/[;\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  private static stripAttrs(stmt: string): string {
    const idx = stmt.indexOf('[');
    return idx === -1 ? stmt : stmt.slice(0, idx);
  }

  private static parseAttrs(s: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    const m = s.match(/\[(.*)\]/);
    if (!m) return attrs;
    for (const part of m[1].split(',')) {
      const eq = part.indexOf('=');
      if (eq === -1) continue;
      const key = part.slice(0, eq).trim();
      let val = part.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      attrs[key] = val;
    }
    return attrs;
  }

  private static createShape(id: string, attrs: Record<string, string>): Shape {
    const label = attrs.label !== undefined ? attrs.label : id;
    const type = (attrs.shape || 'box').toLowerCase();
    const x = this.toNumber(attrs.x, 0);
    const y = this.toNumber(attrs.y, 0);
    const z = this.toNumber(attrs.z, 0);
    const fill = this.toColor(attrs.fillcolor, Color.from('#38bdf866'));
    const border = this.toColor(attrs.color, Color.from('#38bdf8'));

    let shape: Shape;
    switch (type) {
      case 'circle':
      case 'ellipse': {
        const r = this.toNumber(attrs.r, 32);
        shape = new Circle(new Point(x, y, z), r);
        break;
      }
      case 'square': {
        const side = this.toNumber(attrs.w, this.toNumber(attrs.side, 64));
        shape = new Square(new Point(x, y, z), side);
        break;
      }
      case 'diamond': {
        const w = this.toNumber(attrs.w, 110);
        const h = this.toNumber(attrs.h, 56);
        shape = new Diamond(new Point(x, y, z), w, h);
        break;
      }
      case 'cloud': {
        const w = this.toNumber(attrs.w, 140);
        const h = this.toNumber(attrs.h, 60);
        shape = new Cloud(new Point(x, y, z), w, h);
        break;
      }
      case 'cylinder': {
        const w = this.toNumber(attrs.w, 120);
        const h = this.toNumber(attrs.h, 60);
        shape = new Cylinder(new Point(x, y, z), w, h);
        break;
      }
      case 'box':
      case 'rect':
      case 'rectangle':
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

  private static toNumber(value: string | undefined, fallback: number): number {
    if (value === undefined) return fallback;
    const n = parseFloat(value);
    return isNaN(n) ? fallback : n;
  }

  private static toColor(value: string | undefined, fallback: Color): Color {
    if (!value) return fallback;
    try {
      return Color.from(value);
    } catch {
      return fallback;
    }
  }
}
