import assets from "../../assets";
import GenericBlock from "./GenericBlock";

export default class DebugBlock extends GenericBlock {
  constructor(isWall: boolean, lightTransparent: boolean) {
    super(isWall, lightTransparent, assets.wall);
  }
}
