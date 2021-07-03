import { Entity } from "./entities";
import Maze from "./Maze";

export default class Player extends Entity {
  constructor(id: number) {
    super(id, "hero");
    this.target = undefined;

    this.stats.add({ speed: 3, view: 10, damage: 5, health: 100 });
  }

  action(maze: Maze) {
    if (this.stat("health") <= 0) {
      this.x = 1;
      this.y = 1;
      this.stats.set("health", 100);
    }
  }
}
