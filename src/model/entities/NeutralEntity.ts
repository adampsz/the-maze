import Entity from "./Entity";
import { Asset } from "../../assets";

export default abstract class NeutralEntity extends Entity {
  constructor(id: number, texture: Asset) {
    super(id, texture);
  }

  targetReached(): void {
    this.nextMove = [0, 0];
    this.target = undefined;
    this.path = [];
  }

  entityCollision(entity: Entity): void {}
}
