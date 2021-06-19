import Entity from "./Entity";
import assets from "../../assets";

export default class NeutralEntity extends Entity {
  constructor() {
    super(assets.dirt);
    this.target = [6.5, 6.5];
    this.stats.add({ speed: 0.8 });
  }

  targetReached(): void {
    this.nextMove = [0, 0];
    this.target = undefined;
    this.path = [];
  }

  entityCollision(entity: Entity): void {}
}
