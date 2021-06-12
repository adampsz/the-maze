import { Texture } from "pixi.js";

export default abstract class Block {
  isWall: boolean;
  texture: Texture;
  lightTransparent: boolean;

  constructor(
    texture: Texture = Texture.WHITE,
    isWall = true,
    lightTransparent = false
  ) {
    this.texture = texture;
    this.isWall = isWall;
    this.lightTransparent = lightTransparent;
  }
}
