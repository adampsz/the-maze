import { Texture } from "pixi.js";

export default abstract class Block {
  abstract isWall: boolean;
  abstract lightTransparent: boolean;
  abstract texture: Texture;
}
