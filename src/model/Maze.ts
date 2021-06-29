import { Entity } from "./entities";
import { Block, GenericBlock } from "./blocks";
import Player from "./Player";

export default class Maze {
  blocks: Block[][];
  entities: Map<number, Entity>;
  player: Player;

  constructor(width: number, height: number) {
    this.blocks = Maze.generate(width, height);
    this.entities = new Map();

    this.player = new Player(0);
    this.player.x = this.player.y = 1;

    this.spawnEntity(this.player);
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

  blockAction(x: number, y: number) {}
  entityAction(id: number) {}

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
    const positionToKey = (x: number, y: number): string => {
      return String(x) + "_" + String(y);
    };

    const keyToPosition = (position: string): [number, number] => {
      const nums = position.split("_");
      return [parseInt(nums[0]), parseInt(nums[1])];
    };

    const queue: [number, number][] = [[x0, y0]];
    const previous = new Map<string, string>();
    const visited = new Set<string>();
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

      if (visited.has(key) || this.blocks[y][x].isWall) continue;

      if (key == targetKey) break;

      visited.add(key);

      directions.forEach((direction) => {
        queue.push(direction);
        const [x, y] = direction;
        const directionKey = positionToKey(x, y);
        if (!previous.has(directionKey)) previous.set(directionKey, key);
      });
    }

    let [xCur, yCur] = target;
    let curKey = positionToKey(xCur, yCur);
    const path: [number, number][] = [];
    while (curKey != startKey) {
      path.push([xCur + 1 / 2, yCur + 1 / 2]);
      [xCur, yCur] = keyToPosition(previous.get(curKey)!);
      curKey = positionToKey(xCur, yCur);
    }

    return path.reverse();
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

    return blocks;
  }
}
