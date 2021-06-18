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

  private static cache: Record<string, GenericBlock> = {};

  static floor() {
    return (
      this.cache.floor ??
      (this.cache.floor = new this(false, true, assets.floor))
    );
  }

  static wall() {
    return (
      this.cache.wall ?? (this.cache.wall = new this(true, false, assets.wall))
    );
  }
}
