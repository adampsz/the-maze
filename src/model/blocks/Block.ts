import { Asset } from "../../assets";

export default abstract class Block {
  abstract isWall: boolean;
  abstract lightTransparent: boolean;
  abstract lightIntensity: number;
  abstract texture: Asset;
}
