import { Entity } from "./entities";
import assets from "../assets";

export default class Player extends Entity {
  constructor() {
    super(assets.dirt);
  }

  public goto(x: number, y: number): void {
    //TODO
  }

  public dropItems(entity: Entity): void {
    //TODO
  }
}
