import { NeutralEntity } from ".";
import { Entity } from ".";
import { Maze } from "..";

export default class Frog extends NeutralEntity {
  constructor(id: number) {
    super(id, "dirt");
  }

  targetReached(): void {}

  entityCollision(entity: Entity): void {}

  update(maze: Maze) {}
}
