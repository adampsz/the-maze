import { HostileEntity } from ".";
import { Maze } from "..";
import Entity from "./Entity";
import Player from "../Player";

export default class Thief extends Entity {
  constructor(id: number) {
    super(id, "dirt");
    this.target = [6.5, 6.5];
    this.baseStats.add({ speed: 2.0 });
    this.updateStats();
  }
  targetReached(): void {
    throw new Error("Method not implemented.");
  }
  update(maze: Maze): void {
    throw new Error("Method not implemented.");
  }
}
