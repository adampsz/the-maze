import Maze from "../Maze";
import Inventory from "../Inventory";
import Stats from "../Stats";

import { Asset } from "../../assets";

export default abstract class Entity {
  readonly id: number;

  x: number = 0;
  y: number = 0;
  size: number = 0.75;

  texture: Asset;

  inventory: Inventory;

  baseStats: Stats;
  stats: Stats;

  target: [number, number] | undefined;
  defaultTarget: [number, number] | undefined;
  nextMove: [number, number] = [0, 0];
  path: [number, number][] = []; // Potem jakoś by było dobrze zapisywać ścieżkę. Jak generuje się na bieżąco, to czasem wariuje na boki jak postać się dziko rusza

  constructor(id: number, texture: Asset) {
    this.id = id;

    this.texture = texture;

    this.inventory = new Inventory(this);

    this.baseStats = new Stats();
    this.stats = new Stats();

    this.target = undefined;
  }

  update(maze: Maze, delta: number) {
    let [x, y] = this.nextMove;

    if (x || y) {
      const scale = this.stats.get("speed") / Math.hypot(x, y);
      x *= Math.abs(x) * scale * delta;
      y *= Math.abs(y) * scale * delta;
    }

    this.x += x;
    if (maze.checkCollision(this)) this.x -= x;

    this.y += y;
    if (maze.checkCollision(this)) this.y -= y;
  }

  abstract entityCollision(entity: Entity): void;
<<<<<<< HEAD
  abstract targetReached(): void;
  abstract update(maze: Maze): void;
=======
>>>>>>> bc22715e4259a493e65cec5e1a9312346371b351

  updateStats() {
    this.stats = this.baseStats.clone();
    for (const { stats } of this.inventory.equipped()) this.stats.add(stats);
  }

  middlePosition(): [number, number] {
    return [this.x + this.size / 2, this.y + this.size / 2];
  }

  getCollisionData(): [number, number, number, number] {
    return [this.x, this.y, this.size, this.size];
  }

  arrayPosition(): [number, number] {
    return [
      Math.floor(this.x + this.size / 2),
      Math.floor(this.y + this.size / 2),
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
}
