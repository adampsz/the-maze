import { Entity, HostileEntity } from "./entities";
import assets from "../assets";

export default class Player extends Entity {
  constructor() {
    super(assets.dirt);
    this.target = undefined;
    this.stats.add({ speed: 1 });
  }

  targetReached(): void {
    this.nextMove = [0, 0];
    this.target = undefined;
    this.path = [];
  }

  entityCollision(entity: Entity): void {}
}
