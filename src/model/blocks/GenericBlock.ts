import Block from "./Block";
import { Asset } from "../../assets";

export interface GenericBlockOptions {
  isWall?: boolean;
  lightTransparent?: boolean;
  lightIntensity?: number;
  texture?: Asset;
}

export default class GenericBlock extends Block {
  isWall: boolean;
  lightTransparent: boolean;
  lightIntensity: number;
  texture: Asset;

  private constructor({
    isWall,
    lightTransparent,
    lightIntensity,
    texture,
  }: GenericBlockOptions = {}) {
    super();

    this.texture = texture ?? "floor";
    this.isWall = isWall ?? true;
    this.lightTransparent = lightTransparent ?? false;
    this.lightIntensity = lightIntensity ?? 0;
  }

  static floor = new GenericBlock({
    isWall: false,
    lightTransparent: true,
    texture: "floor",
  });

  static wall = new GenericBlock({
    texture: "wall",
  });
}
