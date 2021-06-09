import Block from "./Block";
import assets from "../../assets";

export default class NeutralBlock extends Block {
  constructor(isWall: boolean, lightTransparent: boolean) {
    super(assets.floor, isWall, lightTransparent);
  }
}
