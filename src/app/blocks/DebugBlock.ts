import assets from "../../assets";
import Block from "./Block";

export default class DebugBlock extends Block {
  constructor(isWall?: boolean) {
    super(assets.dirt, isWall);
  }
}
