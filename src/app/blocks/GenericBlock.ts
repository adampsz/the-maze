import { Texture } from "pixi.js";
import Block from "./Block";
import assets from "../../assets";

export default class GenericBlock extends Block {
  isWall: boolean;
  lightTransparent: boolean;
  texture: Texture;

  constructor(isWall: boolean, lightTransparent: boolean, texture: Texture) {
    super();

    this.texture = texture;
    this.isWall = isWall;
    this.lightTransparent = lightTransparent;
  }

  static floor() {
    return new this(false, true, assets.floor);
  }

  static wall() {
    return new this(true, false, assets.wall);
  }
}
