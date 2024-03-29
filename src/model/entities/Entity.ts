import Maze from "../Maze";
import Inventory from "../Inventory";
import Stats from "../Stats";

import { Asset } from "../../assets";

export default abstract class Entity {
  readonly id: number;

  x = 0;
  y = 0;
  width = 0.5;
  height = 0.8;

  texture: Asset;

  inventory: Inventory;

  stats: Stats;

  target: [number, number] | undefined;
  defaultTarget: [number, number] = [this.x, this.y];
  nextMove: [number, number] = [0, 0];
  path: [number, number][] = [];

  constructor(id: number, texture: Asset) {
    this.id = id;

    this.texture = texture;
    this.inventory = new Inventory();
    this.stats = new Stats();
    this.target = undefined;
  }

  abstract action(maze: Maze): void;

  update(maze: Maze, delta: number) {
    this.action(maze);

    let [x, y] = this.nextMove;

    if (x || y) {
      const scale = this.stat("speed") / Math.hypot(x, y);
      x *= Math.abs(x) * scale * delta;
      y *= Math.abs(y) * scale * delta;
    }

    this.x += x;
    if (maze.checkCollision(this)) this.x -= x;

    this.y += y;
    if (maze.checkCollision(this)) this.y -= y;
  }

  stat(stat: string): number {
    let value = this.stats.get(stat);
    for (const item of this.inventory.equipped()) value += item.stats.get(stat);
    return Math.min(value, Stats.max(stat));
  }

  middlePosition(): [number, number] {
    return [this.x + this.width / 2, this.y + this.height / 2];
  }

  getCollisionData(): [number, number, number, number] {
    return [this.x, this.y, this.width, this.height];
  }

  arrayPosition(): [number, number] {
    return [
      Math.floor(this.x + this.width / 2),
      Math.floor(this.y + this.height / 2),
    ];
  }

  updatePath(newTarget: [number, number] | undefined, maze: Maze) {
    if (
      newTarget != null &&
      (this.target == null ||
        newTarget[0] != this.target[0] ||
        newTarget[1] != this.target[1])
    ) {
      this.target = newTarget;
      const [x0, y0] = this.arrayPosition();
      const [xTarget, yTarget] = this.target.map(Math.floor);
      this.path = maze.findPath(x0, y0, xTarget, yTarget);
    }
  }

  targetReached(): void {
    this.nextMove = [0, 0];
    this.target = undefined;
    this.path = [];
  }

  setNextStep() {
    if (this.target != null) {
      const target = this.path.length == 0 ? this.target : this.path[0];
      const [x, y] = this.middlePosition();
      const distance = [
        +(target[0] - x).toFixed(1),
        +(target[1] - y).toFixed(1),
      ];
      if (Math.hypot(...distance) < 0.01) {
        this.targetReached();
        return;
      }
      this.nextMove = [
        distance[0] / Math.abs(distance[0]) || 0,
        distance[1] / Math.abs(distance[1]) || 0,
      ];
    }
  }

  attack(entity: Entity): void {
    if (entity === this) return;

    const damage =
      this.stat("damage") *
      (1 - entity.stat("armor") / (Stats.max("armor") * 2));

    const health = Math.max(entity.stat("health") - damage, 0);
    entity.stats.set("health", health);
  }
}
