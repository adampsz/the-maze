import { Entity } from "./entities";
import { Block, ActionBlock } from "./blocks";
import Generator from "./Generator";
import Player from "./Player";

export default class Maze {
  blocks: Block[][];
  entities: Map<number, Entity>;
  player: Player;

  constructor(width: number, height: number) {
    const generator = new Generator(
      Math.ceil(Math.log2(Math.max(width, height)))
    );

    this.blocks = generator.blocks;
    this.entities = new Map();

    this.player = new Player(0);
    this.player.x = this.player.y = 1;

    this.spawnEntity(this.player);

    generator.entities.forEach((entity) => this.spawnEntity(entity));
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

  entityAction(id: number) {
    const entity = this.entities.get(id);

    const intersects = (
      a: [number, number, number, number],
      b: [number, number, number, number]
    ) => {
      const [x1, y1, w1, h1] = a;
      const [x2, y2, w2, h2] = b;
      return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    };

    if (entity != null) {
      const [x, y, sizeX, sizeY] = this.player.getCollisionData();
      const newData: [number, number, number, number] = [
        x - 0.1,
        y - 0.1,
        sizeX + 0.2,
        sizeY + 0.2,
      ];
      if (intersects(newData, entity.getCollisionData()))
        this.player.attack(entity);
    }
  }

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
}
