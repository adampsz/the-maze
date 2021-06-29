import Maze from "../Maze";
import HostileEntity from "./Entity";
import Entity from "./Entity";
import Player from "../Player";

export default class Monster extends HostileEntity {
  constructor(id: number) {
    super(id, "dirt");
    this.target = [6.5, 6.5];
    this.baseStats.add({ speed: 2.0, damage: 1.0, view: 5 });
    this.updateStats();
  }

  attack(entity: Entity): void {
    const health = Math.max(
      entity.stats.get("health") - this.baseStats.get("damage"),
      0
    );
    entity.stats.set("health", health);
  }

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

  update(maze: Maze, delta: number) {
    super.update(maze, delta);
    /*if (this.isPlayerNearby(maze)) {
    }*/
  }
}
