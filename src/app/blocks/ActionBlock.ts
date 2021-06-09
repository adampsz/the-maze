import Block from "./Block";
import Player from "../Player";

export default abstract class ActionBlock extends Block {
  abstract action(player: Player): void;
}
