import ActionBlock from "./ActionBlock";
import Player from "../Player";
import assets from "../../assets";

export default class ChestBlock extends ActionBlock {
  constructor() {
    super(assets.dirt);
  }

  public action(player: Player): void {
    console.log("clicked");
  }
}
