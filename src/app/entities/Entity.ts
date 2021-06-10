import { Sprite, Texture } from "pixi.js";
import Inventory from "../Inventory";
import Stats from "../Stats";

export default abstract class Entity extends Sprite {
  inventory: Inventory;
  stats: Stats;

  constructor(texture: Texture = Texture.WHITE) {
    super(texture);
    this.width = this.height = 0.75;
    this.inventory = new Inventory();
    this.stats = new Stats();
  }

  abstract goto(x: number, y: number): void;
  abstract dropItems(entity: Entity): void; // A może to nie powinno być abstrakcyjne? Złodziej może nam dropnąć i my możemy złodziejowi

  arrayPosition(): [number, number] {
    return [
      Math.floor(this.position.x + this.width / 2),
      Math.floor(this.position.y + this.height / 2),
    ];
  }
}
