import HostileEntity from "./HostileEntity";
import Maze from "../Maze";

type Point = [number, number];

export default class Archer extends HostileEntity {
  constructor(id: number, x: number, y: number) {
    super(id, "dirt");
    this.x = x;
    this.y = y;
    this.defaultTarget = [x, y];
    this.baseStats.add({ speed: 2.0, damage: 1.0, view: 5, range: 4 });
    this.updateStats();
  }

  isPlayerInAttackRange(maze: Maze) {
    const onSegment = (p: Point, q: Point, r: Point) => {
      return (
        q[0] <= Math.max(p[0], r[0]) &&
        q[0] >= Math.min(p[0], r[0]) &&
        q[1] <= Math.max(p[1], r[1]) &&
        q[1] >= Math.min(p[1], r[1])
      );
    };

    const orientation = (p: Point, q: Point, r: Point) => {
      const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
      if (val == 0) return 0;
      return val > 0 ? 1 : 2;
    };

    const doIntersect = (p1: Point, q1: Point, p2: Point, q2: Point) => {
      const o1 = orientation(p1, q1, p2);
      const o2 = orientation(p1, q1, q2);
      const o3 = orientation(p2, q2, p1);
      const o4 = orientation(p2, q2, q1);

      if (o1 != o2 && o3 != o4) return true;

      if (o1 == 0 && onSegment(p1, p2, q1)) return true;
      if (o2 == 0 && onSegment(p1, q2, q1)) return true;
      if (o3 == 0 && onSegment(p2, p1, q2)) return true;
      if (o4 == 0 && onSegment(p2, q1, q2)) return true;

      return false;
    };

    const collideBlock = (x: number, y: number) => {
      const walls: [Point, Point][] = [
        [
          [x, y],
          [x + 1, y],
        ],
        [
          [x, y],
          [x, y + 1],
        ],
        [
          [x + 1, y],
          [x + 1, y + 1],
        ],
        [
          [x, y + 1],
          [x + 1, y + 1],
        ],
      ];
      for (const wall of walls)
        if (
          doIntersect(
            this.middlePosition(),
            maze.player.middlePosition(),
            ...wall
          )
        )
          return true;
      return false;
    };

    if (!this.isPlayerNearby(maze, this.stats.get("range"))) return false;

    const [x, y] = this.arrayPosition();
    for (
      let i = Math.max(y - this.stats.get("range"), 0);
      i <= Math.min(y + this.stats.get("range"), maze.height - 1);
      i++
    ) {
      for (
        let j = Math.max(x - this.stats.get("range"), 0);
        j <= Math.min(x + this.stats.get("range"), maze.width - 1);
        j++
      ) {
        if (maze.blocks[i][j].isWall && collideBlock(j, i)) return false;
      }
    }
    return true;
  }

  chooseTarget(maze: Maze) {
    if (this.isPlayerNearby(maze, this.stats.get("view")))
      return maze.player.middlePosition();
    return this.defaultTarget;
  }
}
