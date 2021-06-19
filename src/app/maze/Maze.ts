import { Container, Point } from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";
import { Entity } from "../entities";
import { Key } from "../items";
import LightMap from "./LightMap";

import { NeutralEntity, HostileEntity } from "../entities";
import Player from "../Player";

import {
  Block,
  GenericBlock,
  ActionBlock,
  ChestBlock,
  DoorBlock,
} from "../blocks";

export default class Maze extends Container {
  private blocks: Block[][];
  private entities: Set<Entity>;
  private lightPoints: [number, number][]; // Ogólnie zrobiłbym coś w stylu generateLightPoints na podstawie itemków na mapce + pozycja gracza
  private player: Player;

  private container = new Container();

  private tilemap: CompositeTilemap;
  private lightmap: LightMap;

  private readonly SCALE = 16;

  constructor(player: Entity, width: number, height: number) {
    super();

    this.tilemap = new CompositeTilemap();
    this.tilemap.scale.set(1 / this.SCALE);

    this.lightmap = new LightMap(width, height);

    this.addChild(this.tilemap);
    this.addChild(this.container);
    this.addChild(this.lightmap);

    this.blocks = Maze.generate(width, height);
    this.player = player;
    this.entities = new Set([player]);
    this.lightPoints = new Array([1, 1]);

    const temp_entity = new HostileEntity();
    temp_entity.position.x = 3;
    temp_entity.position.y = 1;
    this.entities.add(temp_entity);

    this.mask = this.lightmap;

    // Hack: naprawia interakcję
    Object.assign(this.tilemap, {
      interactive: true,
      containsPoint: () => true,
    });

    this.tilemap.on("mousedown", (event) => {
      const global = event.data.global as Point;
      const local = this.tilemap.worldTransform.applyInverse(global);

      const x = Math.floor(local.x / this.SCALE);
      const y = Math.floor(local.y / this.SCALE);

      if (this.lightmap.getIntensity(x, y) < 0.6) return;

      const block = this.blocks[y]?.[x];

      if (block instanceof ActionBlock) {
        block.action(player);
        this.rebuild();
      }
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

  private isCollision(
    object1: [number, number, number, number],
    object2: [number, number, number, number]
  ): boolean {
    const [x1, y1, width1, height1] = object1;
    const [x2, y2, width2, height2] = object2;
    return (
      x1 < x2 + width2 &&
      x1 + width1 > x2 &&
      y1 < y2 + height2 &&
      y1 + height1 > y2
    );
  }

  private checkCollision(entity: Entity) {
    const [x, y] = entity.arrayPosition();
    const obj1 = entity.getCollisionData();

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const obj2: [number, number, number, number] = [x + j, y + i, 1, 1];
        if (this.blocks[y + i]?.[x + j]?.isWall && this.isCollision(obj1, obj2))
          return true;
      }
    }

    for (const ent of this.entities) {
      const obj2 = ent.getCollisionData();
      if (
        (obj1[0] != obj2[0] || obj1[1] != obj2[1]) &&
        this.isCollision(obj1, obj2)
      ) {
        entity.entityCollision(ent);
        return true;
      }
    }

    return false;
  }

  private moveEntity(entity: Entity, x: number, y: number) {
    if (x || y) {
      const vecLength = Math.hypot(x, y);
      x *= entity.stats.get("speed")!;
      y *= entity.stats.get("speed")!;
      x *= Math.abs(x) / vecLength;
      y *= Math.abs(y) / vecLength;
    }
    entity.position.x += x;
    if (this.checkCollision(entity)) entity.position.x -= x;

    entity.position.y += y;
    if (this.checkCollision(entity)) entity.position.y -= y;
  }

  moveEntities(delta: number) {
    this.entities.forEach((entity) => {
      if (entity instanceof HostileEntity) {
        if (this.hostileEntityCloseToPlayer(entity, 5))
          entity.target = this.player.middlePosition();
        else entity.target = [6, 6];
      }
      this.updateEntityNextMove(entity);
      const [x, y] = entity.nextMove;
      this.moveEntity(entity, x * delta, y * delta);
      entity.nextMove = [0, 0];
    });
  }

  hostileEntityCloseToPlayer(entity: Entity, distance: number): boolean {
    const positionToKey = (x: number, y: number): string => {
      return String(x) + "_" + String(y);
    };

    const [playerX, playerY]: [number, number] = this.player.arrayPosition();
    const [entityX, entityY]: [number, number] = entity.arrayPosition();
    const playerPositionKey = positionToKey(playerX, playerY);
    const queue: [number, number, number][] = [[entityX, entityY, 0]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const [x, y, dist] = queue.shift()!;
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

      if (visited.has(key) || dist > distance) continue;

      visited.add(key);

      if (playerPositionKey == key) return true;

      directions.forEach((direction) => {
        const [x, y] = direction;
        queue.push([x, y, dist + 1]);
      });
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

  updateEntityNextMove(entity: Entity) {
    if (entity.target == null) return;
    const [x0, y0] = entity.arrayPosition();
    const path = this.findPath(
      x0,
      y0,
      Math.floor(entity.target[0]),
      Math.floor(entity.target[1])
    );
    const [x, y] = entity.middlePosition();
    const target = path.length == 0 ? entity.target : path[0];
    const distance = [+(target[0] - x).toFixed(1), +(target[1] - y).toFixed(1)];
    if (Math.hypot(distance[0], distance[1]) < 0.01) {
      entity.targetReached();
      entity.target = undefined;
      return;
    }
    entity.nextMove = [
      distance[0] / Math.abs(distance[0]) || 0,
      distance[1] / Math.abs(distance[1]) || 0,
    ];
  }

  updateVisibilityOfBlocks(entity: Entity) {
    // Potem chyba distance będzie w stats
    const [x, y] = entity.arrayPosition();
    this.lightmap.reset();

    this.lightmap.enlightenArea(this.blocks, x, y, 10);

    this.lightPoints.forEach(([x, y]) => {
      this.lightmap.enlightenArea(this.blocks, x, y, 5);
    });

    this.lightmap.update();
  }

  static generate(width: number, height: number): Block[][] {
    const power = Math.min(Math.log2(width - 1), Math.log2(height - 1)) | 0;
    const size = 2 ** power - 1;

    let blocks = new Array(size + 2).fill(0).map(() => new Array(size + 2));

    for (let i = 0; i < blocks.length; i++) {
      for (let j = 0; j < blocks[i].length; j++) {
        blocks[i][j] = GenericBlock.floor();
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
        blocks[y + i][x] = GenericBlock.wall();
        blocks[y - i][x] = GenericBlock.wall();
        blocks[y][x + i] = GenericBlock.wall();
        blocks[y][x - i] = GenericBlock.wall();
      }

      blocks[y + rotY(0, 1, a)][x + rotX(0, 1, a)] = GenericBlock.floor();
      blocks[y + rotY(s, 0, a)][x + rotX(s, 0, a)] = GenericBlock.floor();
      blocks[y + rotY(-s, 0, a)][x + rotX(-s, 0, a)] = GenericBlock.floor();

      rec(x + rotX(-n - 1, -n - 1, a), y + rotY(-n - 1, -n - 1, a), n, a + 3);
      rec(x + rotX(-n - 1, +n + 1, a), y + rotY(-n - 1, +n + 1, a), n, a + 0);
      rec(x + rotX(+n + 1, +n + 1, a), y + rotY(+n + 1, +n + 1, a), n, a + 0);
      rec(x + rotX(+n + 1, -n - 1, a), y + rotY(+n + 1, -n - 1, a), n, a + 1);
    }

    for (let i = 0; i <= size + 1; i++) {
      blocks[i][0] = GenericBlock.wall();
      blocks[i][size + 1] = GenericBlock.wall();
      blocks[0][i] = GenericBlock.wall();
      blocks[size + 1][i] = GenericBlock.wall();
    }

    rec((size + 1) / 2, (size + 1) / 2, (size - 1) / 2, 0);

    blocks[1][2] = new ChestBlock([new Key(1)]);
    blocks[1][4] = new DoorBlock(1);

    return blocks;
  }
}
