import { Entity } from "./entities";
import assets from "../assets";

export default class Player extends Entity {
  constructor() {
    super(assets.dirt);
    this.target = undefined;

    this.baseStats.add({ speed: 3, view: 10 });
    this.updateStats();
  }

  targetReached(): void {
    this.nextMove = [0, 0];
    this.target = undefined;
    this.path = [];
  }

  entityCollision(entity: Entity): void {}
}
