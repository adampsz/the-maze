import { Archer, Entity, Monster } from "./entities";
import Player from "./Player";
import Stats from "./Stats";
import { WearableItem, Key, Slot } from "./items";

import {
  Block,
  GenericBlock,
  ChestBlock,
  DoorBlock,
  ActionBlock,
} from "./blocks";

export default class Maze {
  blocks: Block[][];
  entities: Map<number, Entity>;
  player: Player;

  constructor(width: number, height: number) {
    this.blocks = Maze.generate(width, height);
    this.entities = new Map();

    this.player = new Player(0);
    this.player.x = this.player.y = 1;

    const tempEntity1 = new Archer(1, 3, 1);
    const tempEntity2 = new Monster(2, 5, 1);
    const tempEntity3 = new Monster(3, 6, 1);
    this.spawnEntity(this.player);
    this.spawnEntity(tempEntity1);
    this.spawnEntity(tempEntity2);
    this.spawnEntity(tempEntity3);
  }

  get width() {
    return this.blocks[0].length;
  }

  get height() {
    return this.blocks.length;
  }

  update(delta: number) {
    this.entities.forEach((entity) => entity.update(this, delta));
  }

  movePlayer(dx: number, dy: number) {
    this.player.nextMove = [dx, dy];
  }

  spawnEntity(entity: Entity) {
    this.entities.set(entity.id, entity);
  }

  entityAction(id: number) {}

  blockAction(x: number, y: number) {
    const block = this.blocks[y]?.[x];
    if (!(block instanceof ActionBlock)) return;

    const path = this.findPath(x, y, this.player.x | 0, this.player.y | 0);
    if (path.length === 0 || path.length > this.player.stats.get("view") * 0.7)
      return;

    block.action(this.player);
  }

  checkCollision(entity: Entity) {
    const [x, y] = entity.arrayPosition();
    const bounds = entity.getCollisionData();

    const intersects = (
      a: [number, number, number, number],
      b: [number, number, number, number]
    ) => {
      const [x1, y1, w1, h1] = a;
      const [x2, y2, w2, h2] = b;
      return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    };

    for (let dx = -1; dx <= 1; dx += 1)
      for (let dy = -1; dy <= 1; dy++)
        if (
          this.blocks[y + dy]?.[x + dx]?.isWall &&
          intersects(bounds, [x + dx, y + dy, 1, 1])
        ) {
          return true;
        }

    for (const other of this.entities.values())
      if (other != entity && intersects(bounds, other.getCollisionData())) {
        return true;
      }

    return false;
  }

  findPath(x0: number, y0: number, xTarget: number, yTarget: number) {
    const positionToKey = (x: number, y: number): number => {
      return y * this.width + x;
    };

    const keyToPosition = (key: number): [number, number] => {
      return [key % this.width, Math.floor(key / this.width)];
    };

    const queue: [number, number][] = [[x0, y0]];

    const previous = new Map<number, number>();
    const visited = new Set<number>();

    const target: [number, number] = [xTarget, yTarget];
    const targetKey = positionToKey(xTarget, yTarget);
    const startKey = positionToKey(x0, y0);

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      const key = positionToKey(x, y);
      const directions: [number, number][] = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
        [x + 1, y - 1],
        [x - 1, y - 1],
        [x + 1, y + 1],
        [x - 1, y + 1],
      ];

      if (key == targetKey) {
        let [xCur, yCur] = target;
        let curKey = positionToKey(xCur, yCur);
        const path: [number, number][] = [];

        while (curKey != startKey) {
          path.push([xCur + 0.5, yCur + 0.5]);
          [xCur, yCur] = keyToPosition(previous.get(curKey)!);
          curKey = positionToKey(xCur, yCur);
        }

        return path.reverse();
      }

      directions.forEach(([x, y]) => {
        const dirKey = positionToKey(x, y);
        const block = this.blocks[y]?.[x];

        if (!block || block.isWall || visited.has(dirKey)) return;
        if (!previous.has(dirKey)) previous.set(dirKey, key);

        queue.push([x, y]);
        visited.add(dirKey);
      });
    }

    return [];
  }

  static generate(width: number, height: number): Block[][] {
    const power = Math.min(Math.log2(width - 1), Math.log2(height - 1)) | 0;
    const size = 2 ** power - 1;

    let blocks = new Array(size + 2).fill(0).map(() => new Array(size + 2));

    for (let i = 0; i < blocks.length; i++)
      for (let j = 0; j < blocks[i].length; j++)
        blocks[i][j] = GenericBlock.floor;

    const rotX = (x: number, y: number, angle: number) =>
      [x, -y, -x, y][angle % 4];

    const rotY = (x: number, y: number, angle: number) =>
      [y, x, -y, -x][angle % 4];

    function rec(x: number, y: number, s: number, a: number) {
      if (s <= 1 || Math.random() < 0.2) return;
      const n = (s - 1) / 2;

      for (let i = 0; i <= s; i++) {
        blocks[y + i][x] = GenericBlock.wall;
        blocks[y - i][x] = GenericBlock.wall;
        blocks[y][x + i] = GenericBlock.wall;
        blocks[y][x - i] = GenericBlock.wall;
      }

      blocks[y + rotY(0, 1, a)][x + rotX(0, 1, a)] = GenericBlock.floor;
      blocks[y + rotY(s, 0, a)][x + rotX(s, 0, a)] = GenericBlock.floor;
      blocks[y + rotY(-s, 0, a)][x + rotX(-s, 0, a)] = GenericBlock.floor;

      rec(x + rotX(-n - 1, -n - 1, a), y + rotY(-n - 1, -n - 1, a), n, a + 3);
      rec(x + rotX(-n - 1, +n + 1, a), y + rotY(-n - 1, +n + 1, a), n, a + 0);
      rec(x + rotX(+n + 1, +n + 1, a), y + rotY(+n + 1, +n + 1, a), n, a + 0);
      rec(x + rotX(+n + 1, -n - 1, a), y + rotY(+n + 1, -n - 1, a), n, a + 1);
    }

    for (let i = 0; i <= size + 1; i++) {
      blocks[i][0] = GenericBlock.wall;
      blocks[i][size + 1] = GenericBlock.wall;
      blocks[0][i] = GenericBlock.wall;
      blocks[size + 1][i] = GenericBlock.wall;
    }

    rec((size + 1) / 2, (size + 1) / 2, (size - 1) / 2, 0);

    blocks[1][2] = new ChestBlock([
      new Key(1),
      new Key(2),
      new WearableItem("Small torch", Slot.torch, new Stats({ view: 4 })),
      new WearableItem("Big torch", Slot.torch, new Stats({ view: 20 })),
      new WearableItem("Buty 7-milowe", Slot.armor, new Stats({ speed: 4 })),
    ]);

    blocks[1][4] = new DoorBlock(2);

    return blocks;
  }
}
