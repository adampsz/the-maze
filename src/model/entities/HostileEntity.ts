import { Asset } from "../../assets";
import Maze from "../Maze";
import { Entity } from ".";

export default abstract class HostileEntity extends Entity {
  attackCounter: number = 0;

  constructor(id: number, texture: Asset) {
    super(id, texture);
  }

  isPlayerNearby(maze: Maze, distance: number) {
    const positionToKey = (x: number, y: number): number => {
      return y * maze.width + x;
    };

    const [playerX, playerY]: [number, number] = maze.player.arrayPosition();
    const [entityX, entityY]: [number, number] = this.arrayPosition();
    const playerPositionKey = positionToKey(playerX, playerY);
    const queue: [number, number, number][] = [[entityX, entityY, 0]];
    const visited = new Set<number>();

    while (queue.length > 0) {
      const [x, y, dist] = queue.shift()!;
      const key = positionToKey(x, y);
      const directions: [number, number][] = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
        [x + 1, y - 1],
        [x - 1, y - 1],
        [x + 1, y + 1],
        [x - 1, y + 1],
      ];

      if (visited.has(key) || dist > distance) continue;

      visited.add(key);

      if (playerPositionKey == key) return true;

      directions.forEach((direction) => {
        const [x, y] = direction;
        if (!maze.blocks[y][x].isWall) queue.push([x, y, dist + 1]);
      });
    }

    return false;
  }

  abstract isPlayerInAttackRange(maze: Maze): boolean;
  abstract chooseTarget(maze: Maze): [number, number] | undefined;

  action(maze: Maze) {
    this.attackCounter = Math.max(0, this.attackCounter - 1);
    if (this.isPlayerInAttackRange(maze)) {
      this.targetReached();
      if (this.attackCounter == 0) {
        this.attack(maze.player);
        this.attackCounter = 60;
      }
    } else {
      const newTarget = this.chooseTarget(maze);
      this.updatePath(newTarget, maze);
      this.setNextStep();
    }
  }
}
