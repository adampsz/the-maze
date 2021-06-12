import { Container, Point } from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";
import { Entity } from "../entities";

import {
  Block,
  DebugBlock,
  NeutralBlock,
  ActionBlock,
  ChestBlock,
} from "../blocks";
import LightMap from "./LightMap";

export default class Maze extends Container {
  private blocks: Block[][];
  private entities: Set<Entity>;
  private lightPoints: [number, number][]; // Ogólnie zrobiłbym coś w stylu generateLightPoints na podstawie itemków na mapce + pozycja gracza

  private tilemap = new CompositeTilemap();
  private container = new Container();
  private lightmap: LightMap;

  private readonly SCALE = 16;

  constructor(player: Entity, width: number, height: number) {
    super();

    this.lightmap = new LightMap(width, height);
    this.addChild(this.tilemap);
    this.addChild(this.container);
    this.addChild(this.lightmap);
    this.tilemap.scale.set(1 / this.SCALE);
    this.tilemap.cacheAsBitmap = true;

    this.blocks = Maze.generate(width, height);
    this.entities = new Set([player]);
    this.lightPoints = new Array([1, 1]);

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
        this.tilemap.tile(block.texture, x * this.SCALE, y * this.SCALE, {
          tileWidth: this.SCALE,
          tileHeight: this.SCALE,
        });
      })
    );

    this.entities.forEach((entity) => {
      this.container.addChild(entity);
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

  updateVisibilityOfBlocks(entity: Entity) {
    // Potem chyba distance będzie w stats
    const [x, y] = entity.arrayPosition();
    this.lightmap.reset();

    this.lightmap.enlightenArea(this.blocks, x, y, 10);

    this.lightPoints.forEach(([x, y]) => {
      this.lightmap.enlightenArea(this.blocks, x, y, 5, "#fd9");
    });

    this.lightmap.update();
  }

  static generate(width: number, height: number): Block[][] {
    const power = Math.min(Math.log2(width - 1), Math.log2(height - 1)) | 0;
    const size = 2 ** power - 1;

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
