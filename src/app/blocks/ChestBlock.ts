import assets from "../../assets";
import Player from "../Player";
import { Item } from "../items";
import ActionBlock from "./ActionBlock";

export default class ChestBlock extends ActionBlock {
  contents: Item[];

  lightTransparent = true;

  get isWall() {
    return this.contents.length > 0;
  }

  get texture() {
    return this.contents.length > 0 ? assets.dirt : assets.floor;
  }

  constructor(contents: Item[] = []) {
    super();
    this.contents = contents;
  }

  public action(player: Player): void {
    this.contents.forEach((item) => player.inventory.collect(item));
    this.contents = [];
  }
}
