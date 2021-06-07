import { Texture } from "pixi.js";
import Block from "./Block";
import Player from "../Player";

export default abstract class ActionBlock extends Block {
  constructor(texture = Texture.EMPTY, isWall = false) {
    super(texture, isWall);
  }

  abstract playerAction(player: Player): void;
}
