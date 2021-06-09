import { Sprite, Texture } from "pixi.js";
import assets from "../../assets";

export default abstract class Block {
  isWall: boolean;
  texture: Texture;
  lightTransparent: boolean;
  visible = false;
  hiddenTexture = assets.darkness;

  constructor(texture: Texture = Texture.WHITE, isWall = true, lightTransparent = false) {
    this.texture = texture;
    this.isWall = isWall;
    this.lightTransparent = lightTransparent;
  }
}
