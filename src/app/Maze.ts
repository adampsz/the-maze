import { Container } from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";
import { Block, DebugBlock } from "./blocks";
import { Entity } from "./entities";

export default class Maze extends Container {
  private blocks: (Block | null)[][];
  private entities: Set<Entity>;

  private tilemap = new CompositeTilemap();
  private container = new Container();

  private readonly SCALE = 16;

  constructor(player: Entity) {
    super();

    this.addChild(this.tilemap);
    this.addChild(this.container);
    this.container.scale.set(this.SCALE);

    this.blocks = Maze.generate();
    this.entities = new Set([player]);

    this.rebuild();
  }

  private rebuild() {
    this.tilemap.clear();
    this.container.removeChildren();

    this.blocks.forEach((row, y) =>
      row.forEach((block, x) => {
        if (block)
          this.tilemap.tile(block.texture, x * this.SCALE, y * this.SCALE, {
            tileWidth: this.SCALE,
            tileHeight: this.SCALE,
          });
      })
    );

    this.entities.forEach((entity) => {
      this.container.addChild(entity);
    });
  }

  moveEntity(entity: Entity, x: number, y: number) {
    entity.position.x += x;
    entity.position.y += y;

    // TODO: Prawdziwa detekcja kolizji
    let ax = entity.position.x + 0.4 + 0.4 * Math.sign(x);
    let ay = entity.position.y + 0.4 + 0.4 * Math.sign(y);

    if (this.blocks[Math.floor(ay)]?.[Math.floor(ax)]?.isWall) {
      entity.position.x -= x;
      entity.position.y -= y;
    }
  }

  static generate(): (Block | null)[][] {
    //TODO - może jakoś inaczej trzymać labirynt?

    const wall = new DebugBlock(true);
    return [[wall, wall, wall], [wall, null, wall, wall], [wall]];
  }
}
