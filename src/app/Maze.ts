import { Container } from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";
import { Block, DebugBlock } from "./blocks";
import { Entity } from "./entities";

export default class Maze extends Container {
  private blocks: (Block | null)[][];
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

    this.rebuild();
  }

  private rebuild() {
    this.tilemap.clear();
    this.container.removeChildren();

    this.blocks.forEach((row, y) =>
      row.forEach((block, x) => {
        if (block)
          this.tilemap.tile(block.texture, x * this.SCALE, y * this.SCALE, {
            tileWidth: this.SCALE,
            tileHeight: this.SCALE,
          });
      })
    );

    this.entities.forEach((entity) => {
      this.container.addChild(entity);
      entity.position.x = -3;
    });
  }

  private blockCollide(entity: Entity, block_x: number, block_y: number): boolean {
    return (
      entity.position.x < block_x + 1 &&
      entity.position.x + entity.width > block_x &&
      entity.position.y < block_y + 1 &&
      entity.position.y + entity.height > block_y
    );
  }

  private checkCollision(entity: Entity){
    const x = Math.floor(entity.position.x);
    const y = Math.floor(entity.position.y);
    for (let i = Math.max(0, y-1); i < Math.min(this.blocks.length, y+2); i++) {
      for (let j = Math.max(0, x-1); j < Math.min(this.blocks[i].length, x+2); j++) {
        let block = this.blocks[i][j];
        if(block?.isWall && this.blockCollide(entity, j, i))
          return true;
      }
    }
    return false;
  }

  moveEntity(entity: Entity, x: number, y: number) {
    entity.position.x += x;
    if(this.checkCollision(entity))
      entity.position.x -= x;
    entity.position.y += y;
    if(this.checkCollision(entity))
      entity.position.y -= y;
  }

  static generate(): (Block | null)[][] {
    const size = 2 ** 5 - 1;
    const wall = new DebugBlock(true);

    let blocks = new Array(size + 2)
      .fill(0)
      .map(() => new Array(size + 2).fill(null));

    const rotX = (x: number, y: number, angle: number) =>
      [x, -y, -x, y][angle % 4];

    const rotY = (x: number, y: number, angle: number) =>
      [y, x, -y, -x][angle % 4];

    function rec(x: number, y: number, s: number, a: number) {
      if (s <= 1 || Math.random() < 0.2) return;
      const n = (s - 1) / 2;

      for (let i = 0; i <= s; i++) {
        blocks[y + i][x] = blocks[y - i][x] = wall;
        blocks[y][x + i] = blocks[y][x - i] = wall;
      }

      blocks[y + rotY(0, 1, a)][x + rotX(0, 1, a)] = null;
      blocks[y + rotY(s, 0, a)][x + rotX(s, 0, a)] = null;
      blocks[y + rotY(-s, 0, a)][x + rotX(-s, 0, a)] = null;

      rec(x + rotX(-n - 1, -n - 1, a), y + rotY(-n - 1, -n - 1, a), n, a + 3);
      rec(x + rotX(-n - 1, +n + 1, a), y + rotY(-n - 1, +n + 1, a), n, a + 0);
      rec(x + rotX(+n + 1, +n + 1, a), y + rotY(+n + 1, +n + 1, a), n, a + 0);
      rec(x + rotX(+n + 1, -n - 1, a), y + rotY(+n + 1, -n - 1, a), n, a + 1);
    }

    for (let i = 0; i <= size + 1; i++) {
      blocks[i][0] = blocks[i][size + 1] = wall;
      blocks[0][i] = blocks[size + 1][i] = wall;
    }

    rec((size + 1) / 2, (size + 1) / 2, (size - 1) / 2, 0);

    return blocks;
  }
}
