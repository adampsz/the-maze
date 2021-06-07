import { Sprite, Texture } from "pixi.js";

export default abstract class Block {
  isWall: boolean;
  texture: Texture;

  constructor(texture: Texture = Texture.WHITE, isWall = true) {
    this.texture = texture;
    this.isWall = isWall;
  }
}
