import { Asset } from "../../assets";
import Maze from "../Maze";
import Entity from "./Entity";

export default abstract class HostileEntity extends Entity {
  constructor(id: number, texture: Asset) {
    super(id, texture);
  }

  isPlayerNearby(maze: Maze) {
    const positionToKey = (x: number, y: number): string => {
      return String(x) + "_" + String(y);
    };

    const [playerX, playerY]: [number, number] = maze.player.arrayPosition();
    const [entityX, entityY]: [number, number] = this.arrayPosition();
    const playerPositionKey = positionToKey(playerX, playerY);
    const queue: [number, number, number][] = [[entityX, entityY, 0]];
    const visited = new Set<string>();

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

      if (visited.has(key) || dist > this.stats.get("view")) continue;

      visited.add(key);

      if (playerPositionKey == key) return true;

      directions.forEach((direction) => {
        const [x, y] = direction;
        queue.push([x, y, dist + 1]);
      });
    }

    return false;
  }

  abstract attack(entity: Entity): void;
}
