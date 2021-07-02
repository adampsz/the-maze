import { Entity } from "./entities";
import Maze from "./Maze";

export default class Player extends Entity {
  constructor(id: number) {
    super(id, "hero");
    this.target = undefined;

    this.baseStats.add({ speed: 3, view: 10, damage: 5 });
    this.stats.add({ health: 100 });
    this.updateStats();
  }

  action(maze: Maze) {
    if (this.stats.get("health") == 0) {
      this.x = 1;
      this.y = 1;
      this.stats.set("health", 100);
    }
  }

  targetReached(): void {
    this.nextMove = [0, 0];
    this.target = undefined;
    this.path = [];
  }
}
