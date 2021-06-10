import { Container, Point } from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";
import { Entity } from "./entities";

import {
  Block,
  DebugBlock,
  NeutralBlock,
  ActionBlock,
  ChestBlock,
} from "./blocks";

export default class Maze extends Container {
  private blocks: Block[][];
  private entities: Set<Entity>;

  private tilemap = new CompositeTilemap();
  private container = new Container();

  private readonly SCALE = 16;

  constructor(player: Entity) {
    super();

    this.addChild(this.tilemap);
    this.addChild(this.container);
    this.tilemap.scale.set(1 / this.SCALE);

    this.blocks = Maze.generate();
    this.entities = new Set([player]);

    // Hack: naprawia interakcję
    Object.assign(this.tilemap, {
      interactive: true,
      containsPoint: () => true,
    });

    this.tilemap.on("mousedown", (event) => {
      const point = this.tilemap.worldTransform.applyInverse(
        event.data.global as Point
      );
      const x = Math.floor(point.x / this.SCALE);
      const y = Math.floor(point.y / this.SCALE);

      const block = this.blocks[y]?.[x];
      if (block instanceof ActionBlock) block.action(player);
    });

    this.rebuild();
  }

  private rebuild() {
    this.tilemap.clear();
    this.container.removeChildren();

    this.blocks.forEach((row, y) =>
      row.forEach((block, x) => {
        this.drawTile(block, x, y);
      })
    );

    this.entities.forEach((entity) => {
      this.container.addChild(entity);
    });
  }

  private drawTile(block: Block, x: number, y: number) {
    let texture = block.texture;
    if (!block.visible) texture = block.hiddenTexture;

    this.tilemap.tile(texture, x * this.SCALE, y * this.SCALE, {
      tileWidth: this.SCALE,
      tileHeight: this.SCALE,
      alpha: block.distanceToLight,
    });
  }

  private blockCollide(
    entity: Entity,
    block_x: number,
    block_y: number
  ): boolean {
    return (
      entity.position.x < block_x + 1 &&
      entity.position.x + entity.width > block_x &&
      entity.position.y < block_y + 1 &&
      entity.position.y + entity.height > block_y
    );
  }

  private checkCollision(entity: Entity) {
    const [x, y] = entity.arrayPosition();

    for (let i = -1; i <= 1; i++)
      for (let j = -1; j <= 1; j++)
        if (
          this.blocks[y + i]?.[x + j]?.isWall &&
          this.blockCollide(entity, x + j, y + i)
        )
          return true;

    return false;
  }

  moveEntity(entity: Entity, x: number, y: number) {
    entity.position.x += x;
    if (this.checkCollision(entity)) entity.position.x -= x;

    entity.position.y += y;
    if (this.checkCollision(entity)) entity.position.y -= y;
  }

  private enlighteningBfs(xBegin: number, yBegin: number, maxDistance: number) {
    const queue: [number, number, number][] = [[xBegin, yBegin, 0]];

    while (queue.length > 0) {
      const [x, y, dist] = queue.shift()!;

      if (
        Math.hypot(x - xBegin, y - yBegin) > maxDistance ||
        dist > Math.SQRT2 * maxDistance ||
        this.blocks[y][x].visible
      ) {
        continue;
      }

      this.blocks[y][x].visible = true;
      this.blocks[y][x].distanceToLight = 1 - dist / (Math.SQRT2 * maxDistance);

      if (this.blocks[y][x].lightTransparent) {
        queue.push([x + 1, y, dist + 1]);
        queue.push([x - 1, y, dist + 1]);
        queue.push([x, y + 1, dist + 1]);
        queue.push([x, y - 1, dist + 1]);

        if (!this.blocks[y + 1][x + 1].lightTransparent)
          queue.push([x + 1, y + 1, dist + 1]);

        if (!this.blocks[y + 1][x - 1].lightTransparent)
          queue.push([x - 1, y + 1, dist + 1]);

        if (!this.blocks[y - 1][x + 1].lightTransparent)
          queue.push([x + 1, y - 1, dist + 1]);

        if (!this.blocks[y - 1][x - 1].lightTransparent)
          queue.push([x - 1, y - 1, dist + 1]);
      }
    }
  }

  private makeBlocksHidden(entity: Entity, distance: number) {
    // const [x, y] = entity.arrayPosition();
    // const dist = distance + 3;
    // const left = Math.max(x - dist, 0);
    // const top = Math.max(y - dist, 0);
    // const right = Math.min(x + dist, this.blocks[y].length);
    // const bottom = Math.min(y + dist, this.blocks.length);

    // for (let i = top; i < bottom; i++) {
    //   for (let j = left; j < right; j++) {
    //     this.blocks[i][j].visible = false;
    //   }
    // }
    for (let i = 0; i < this.blocks.length; i++) {
      for (let j = 0; j < this.blocks[i].length; j++) {
        this.blocks[i][j].visible = false;
      }
    }
  }

  updateVisibilityOfBlocks(entity: Entity, distance: number) {
    // Potem chyba distance będzie w stats
    const [x, y] = entity.arrayPosition();
    this.makeBlocksHidden(entity, distance);
    this.enlighteningBfs(x, y, distance);
    this.rebuild();
  }

  static generate(): Block[][] {
    const size = 2 ** 5 - 1;

    let blocks = new Array(size + 2).fill(0).map(() => new Array(size + 2));

    for (let i = 0; i < blocks.length; i++) {
      for (let j = 0; j < blocks[i].length; j++) {
        blocks[i][j] = new NeutralBlock(false, true);
      }
    }

    const rotX = (x: number, y: number, angle: number) =>
      [x, -y, -x, y][angle % 4];

    const rotY = (x: number, y: number, angle: number) =>
      [y, x, -y, -x][angle % 4];

    function rec(x: number, y: number, s: number, a: number) {
      if (s <= 1 || Math.random() < 0.2) return;
      const n = (s - 1) / 2;

      for (let i = 0; i <= s; i++) {
        blocks[y + i][x] = new DebugBlock(true, false);
        blocks[y - i][x] = new DebugBlock(true, false);
        blocks[y][x + i] = new DebugBlock(true, false);
        blocks[y][x - i] = new DebugBlock(true, false);
      }

      blocks[y + rotY(0, 1, a)][x + rotX(0, 1, a)] = new NeutralBlock(
        false,
        true
      );

      blocks[y + rotY(s, 0, a)][x + rotX(s, 0, a)] = new NeutralBlock(
        false,
        true
      );

      blocks[y + rotY(-s, 0, a)][x + rotX(-s, 0, a)] = new NeutralBlock(
        false,
        true
      );

      rec(x + rotX(-n - 1, -n - 1, a), y + rotY(-n - 1, -n - 1, a), n, a + 3);
      rec(x + rotX(-n - 1, +n + 1, a), y + rotY(-n - 1, +n + 1, a), n, a + 0);
      rec(x + rotX(+n + 1, +n + 1, a), y + rotY(+n + 1, +n + 1, a), n, a + 0);
      rec(x + rotX(+n + 1, -n - 1, a), y + rotY(+n + 1, -n - 1, a), n, a + 1);
    }

    for (let i = 0; i <= size + 1; i++) {
      blocks[i][0] = new DebugBlock(true, false);
      blocks[i][size + 1] = new DebugBlock(true, false);
      blocks[0][i] = new DebugBlock(true, false);
      blocks[size + 1][i] = new DebugBlock(true, false);
    }

    rec((size + 1) / 2, (size + 1) / 2, (size - 1) / 2, 0);

    blocks[1][2] = new ChestBlock();

    return blocks;
  }
}
