import { Entity } from "./entities";
import assets from "../assets";
import Stats from "./Stats";

export default class Player extends Entity {
  constructor() {
    super(assets.dirt);
    this.stats.add(new Stats());
  }

  public goto(x: number, y: number): void {
    //TODO
  }

  public dropItems(entity: Entity): void {
    //TODO
  }
}
