import { HostileEntity } from ".";
import { Maze } from "..";
import Entity from "./Entity";

export default class Thief extends HostileEntity {
  constructor(id: number) {
    super(id, "dirt");
  }
  entityCollision(entity: Entity): void {
    throw new Error("Method not implemented.");
  }
  targetReached(): void {
    throw new Error("Method not implemented.");
  }
  update(maze: Maze): void {
    throw new Error("Method not implemented.");
  }
}
