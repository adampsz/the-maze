import { Texture } from "pixi.js";
import assets from "../../assets";
import Player from "../Player";
import { Item } from "../items";
import ActionBlock from "./ActionBlock";

export default class ChestBlock extends ActionBlock {
  contents: Item[];

  isWall = true;
  lightTransparent = true;

  texture: Texture;

  constructor(contents: Item[] = []) {
    super();
    this.texture = assets.dirt;
    this.contents = contents;
  }

  public action(player: Player): void {
    this.contents.forEach((item) => player.inventory.collect(item));
    this.contents = [];
  }
}
