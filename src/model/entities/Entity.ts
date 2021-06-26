import Inventory from "../Inventory";
import Stats from "../Stats";
import { Asset } from "../../assets";
import Maze from "../Maze";

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

  abstract entityCollision(entity: Entity): void;
  abstract update(maze: Maze): void;

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
}
