import { Entity } from "./entities";
import Maze from "./Maze";

export default class Player extends Entity {
  constructor(id: number) {
    super(id, "dirt");
    this.target = undefined;

    this.baseStats.add({ speed: 3, view: 10 });
    this.updateStats();
  }

  action(maze: Maze) {}

  targetReached(): void {
    this.nextMove = [0, 0];
    this.target = undefined;
    this.path = [];
  }

  entityCollision(entity: Entity): void {}
}
