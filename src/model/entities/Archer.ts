import { HostileEntity } from ".";
import { Maze } from "..";

export default class Archer extends HostileEntity {
  constructor(id: number) {
    super(id, "dirt");
    this.target = [6.5, 6.5];
    this.baseStats.add({ speed: 2.0, damage: 1.0, view: 5 });
    this.updateStats();
    this.defaultTarget = [4, 4];
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

  update(maze: Maze) {
    const newTarget = this.chooseTarget(maze);
    this.updatePath(newTarget, maze);
    this.setNextStep();
  }
}
