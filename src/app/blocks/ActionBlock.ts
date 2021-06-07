import Block from "./Block";
import Player from "../Player";
import Vector from "../Vector";

export default abstract class ActionBlock extends Block {
  constructor(isWall: boolean, position: Vector) {
    super(isWall, position);
  }

  abstract playerAction(player: Player): void;
}
