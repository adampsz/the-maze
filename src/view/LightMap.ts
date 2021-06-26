import { Sprite, BaseTexture, Texture } from "pixi.js";
import { Block } from "../blocks";

export default class Lights extends Sprite {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width + 1;
    canvas.height = height + 1;

    super(new Texture(new BaseTexture(canvas)));

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;

    this.pivot.set(0.5, 0.5);
  }

  update() {
    this.texture.baseTexture.update();
  }

  reset() {
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  enlightenBlock(x: number, y: number, value: number) {
    this.ctx.globalAlpha = 1 - value;
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(x, y, 2, 2);
  }

  enlightenArea(blocks: Block[][], x0: number, y0: number, distance: number) {
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

      visited.add(key);

      if (!blocks[y][x].isWall) this.enlightenBlock(x, y, alpha);

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
