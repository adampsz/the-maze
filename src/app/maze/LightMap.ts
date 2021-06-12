import { BaseTexture, Sprite, Texture, Point, BLEND_MODES } from "pixi.js";
import { Block } from "../blocks";

export default class Lights extends Sprite {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    super(new Texture(new BaseTexture(canvas)));

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;

    this.blendMode = BLEND_MODES.MULTIPLY;
    this.interactive = true;
  }

  containsPoint(point: Point): boolean {
    const { x, y } = this.worldTransform.applyInverse(point);
    const { data } = this.ctx.getImageData(x | 0, y | 0, 1, 1);
    const shade = (data[0] + data[1] + data[2]) / 3;
    return shade < 100;
  }

  update() {
    this.texture.baseTexture.update();
  }

  reset() {
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  enlightenBlock(x: number, y: number, value: number, color = "#fff") {
    this.ctx.globalAlpha = 1 - value;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, 1, 1);
  }

  enlightenArea(
    blocks: Block[][],
    x0: number,
    y0: number,
    distance: number,
    color = "#fff"
  ) {
    const queue: [number, number, number][] = [[x0, y0, 0]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const [x, y, d] = queue.shift()!;
      const alpha = d / (Math.SQRT2 * distance);
      const key = String(x) + "_" + String(y);

      if (
        Math.hypot(x - x0, y - y0) > distance ||
        d > Math.SQRT2 * distance ||
        visited.has(key)
      ) {
        continue;
      }

      this.enlightenBlock(x, y, alpha, color);
      visited.add(key);

      if (blocks[y][x].lightTransparent) {
        queue.push([x + 1, y, d + 1]);
        queue.push([x - 1, y, d + 1]);
        queue.push([x, y + 1, d + 1]);
        queue.push([x, y - 1, d + 1]);

        if (!blocks[y + 1][x + 1].lightTransparent)
          queue.push([x + 1, y + 1, d + 1]);

        if (!blocks[y + 1][x - 1].lightTransparent)
          queue.push([x - 1, y + 1, d + 1]);

        if (!blocks[y - 1][x + 1].lightTransparent)
          queue.push([x + 1, y - 1, d + 1]);

        if (!blocks[y - 1][x - 1].lightTransparent)
          queue.push([x - 1, y - 1, d + 1]);
      }
    }
  }
}
