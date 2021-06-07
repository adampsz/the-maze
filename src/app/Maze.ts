import { Block } from "./blocks";

export default class Maze {
  private mazeMap: Block[][];

  constructor(source: string) {
    this.mazeMap = this.generate(source);
  }

  private generate(source: string): Block[][] {
    //TODO - może jakoś inaczej trzymać labirynt?
    return [];
  }
}
