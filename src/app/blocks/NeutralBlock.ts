import Block from "./Block";
import Vector from "../Vector";

export default class NeutralBlock extends Block {
  constructor(isWall: boolean, position: Vector) {
    super(isWall, position);
  }
}
