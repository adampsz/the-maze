import ActionBlock from "./ActionBlock";
import Player from "../Player";
import Vector from "../Vector";

export default class ChestBlock extends ActionBlock {
  constructor(position: Vector) {
    super(true, position);
  }

  public playerAction(player: Player): void {
    //TODO
  }
}