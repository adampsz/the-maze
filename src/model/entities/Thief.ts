import Maze from "../Maze";
import { HostileEntity } from ".";
import Entity from "./Entity";

export default class Thief extends HostileEntity {
  stolenItem: boolean = false;

  width = 0.8;
  height = 0.8;

  constructor(id: number, x: number, y: number) {
    super(id, "gnome");
    this.x = x;
    this.y = y;
    this.defaultTarget = [x, y];
    this.stats.add({ damage: 4, speed: 2.0, view: 5, health: 20 });
  }

  attack(entity: Entity): void {
    const entityInventory = entity.inventory.contents();
    if (entityInventory.length == 0 || this.stolenItem) {
      super.attack(entity);
      return;
    }
    const randId = Math.floor(Math.random() * entityInventory.length);
    const item = entityInventory[randId];
    entity.inventory.take(item);
    this.inventory.collect(item);
    this.stolenItem = true;
  }

  isPlayerInAttackRange(maze: Maze) {
    const intersects = (
      a: [number, number, number, number],
      b: [number, number, number, number]
    ) => {
      const [x1, y1, w1, h1] = a;
      const [x2, y2, w2, h2] = b;
      return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    };
    const [x, y, sizeX, sizeY] = super.getCollisionData();
    const newData: [number, number, number, number] = [
      x - 0.1,
      y - 0.1,
      sizeX + 0.2,
      sizeY + 0.2,
    ];
    return intersects(newData, maze.player.getCollisionData());
  }

  chooseTarget(maze: Maze): [number, number] {
    if (this.isPlayerNearby(maze, this.stat("view")) && !this.stolenItem) {
      return maze.player.middlePosition();
    } else if (this.stolenItem) {
      return [1, 1]; // Albo gdzieś indziej gdzie ma uciekać
    } else {
      return this.defaultTarget;
    }
  }
}
