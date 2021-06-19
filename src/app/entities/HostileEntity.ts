import Entity from "./Entity";
import assets from "../../assets";
import { PlaneGeometry } from "pixi.js";
import Player from "../Player";

export default class HostileEntity extends Entity {
  constructor() {
    super(assets.dirt);
    this.target = [6.5, 6.5];
    this.stats.add({ speed: 0.8 });
  }

  attack(entity: Entity): void {}

  targetReached(): void {
    this.nextMove = [0, 0];
    this.target = undefined;
    this.path = [];
  }

  entityCollision(entity: Entity): void {
    if (entity instanceof Player) {
      this.attack(entity);
      this.targetReached();
    }
  }
}
