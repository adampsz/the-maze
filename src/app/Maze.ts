import { CompositeTilemap } from "@pixi/tilemap";
import { Block, DebugBlock } from "./blocks";

export default class Maze extends CompositeTilemap {
  private blocks: (Block | null)[][];

  constructor() {
    super();
    this.blocks = Maze.generate();
    this.rebuild();
  }

  private rebuild() {
    this.clear();

    const size = 16;

    this.blocks.forEach((row, y) =>
      row.forEach((block, x) => {
        if (block)
          this.tile(block.texture, x * size, y * size, {
            tileWidth: size,
            tileHeight: size,
          });
      })
    );
  }

  static generate(): (Block | null)[][] {
    //TODO - może jakoś inaczej trzymać labirynt?

    const wall = new DebugBlock(true);
    return [[wall, wall, wall], [wall, null, wall, wall], [wall]];
  }
}
