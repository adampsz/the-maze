import { Sprite, Texture } from "pixi.js";

export default abstract class Entity extends Sprite {
  constructor(texture: Texture = Texture.WHITE) {
    super(texture);
    this.width = this.height = 0.8;
  }

  abstract goto(x: number, y: number): void;
  abstract dropItems(entity: Entity): void; // A może to nie powinno być abstrakcyjne? Złodziej może nam dropnąć i my możemy złodziejowi
}
