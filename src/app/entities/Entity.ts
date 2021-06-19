import { Sprite, Texture } from "pixi.js";
import Inventory from "../Inventory";
import Stats from "../Stats";

export default abstract class Entity extends Sprite {
  inventory: Inventory;
  stats: Stats;
  target: [number, number] | undefined;
  nextMove: [number, number] = [0, 0];
  path: [number, number][] = []; // Potem jakoś by było dobrze zapisywać ścieżkę. Jak generuje się na bieżąco, to czasem wariuje na boki jak postać się dziko rusza

  constructor(texture: Texture = Texture.WHITE) {
    super(texture);
    this.width = this.height = 0.75;
    this.inventory = new Inventory();
    this.stats = new Stats();
  }

  abstract targetReached(): void;
  abstract entityCollision(entity: Entity): void;

  dropItems(entity: Entity): void {} // TODO

  middlePosition(): [number, number] {
    return [
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
    ];
  }

  getCollisionData(): [number, number, number, number] {
    return [this.position.x, this.position.y, this.width, this.height];
  }

  arrayPosition(): [number, number] {
    return [
      Math.floor(this.position.x + this.width / 2),
      Math.floor(this.position.y + this.height / 2),
    ];
  }
}
