import Entity from "./Entity";
import Player from "../Player";
import assets from "../../assets";

export default class Thief extends Entity {
  constructor() {
    super(assets.dirt);
    this.target = [6.5, 6.5];
    this.baseStats.add({ speed: 2.0 });
    this.updateStats();
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
