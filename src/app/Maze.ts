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
      entity.position.x = -3;
    });
  }

  private blockCollide(entity: Entity, block_x: number, block_y: number): boolean {
    return (
      entity.position.x < block_x + 1 &&
      entity.position.x + entity.width > block_x &&
      entity.position.y < block_y + 1 &&
      entity.position.y + entity.height > block_y
    );
  }

  private checkCollision(entity: Entity){
    const x = Math.floor(entity.position.x);
    const y = Math.floor(entity.position.y);
    for (let i = Math.max(0, y-1); i < Math.min(this.blocks.length, y+2); i++) {
      for (let j = Math.max(0, x-1); j < Math.min(this.blocks[i].length, x+2); j++) {
        let block = this.blocks[i][j];
        if(block?.isWall && this.blockCollide(entity, j, i))
          return true;
      }
    }
    return false;
  }

  moveEntity(entity: Entity, x: number, y: number) {
    entity.position.x += x;
    if(this.checkCollision(entity))
      entity.position.x -= x;
    entity.position.y += y;
    if(this.checkCollision(entity))
      entity.position.y -= y;
  }

  static generate(): (Block | null)[][] {
    //TODO - może jakoś inaczej trzymać labirynt?

    const wall = new DebugBlock(true);
    return [[wall, wall, wall, wall, wall], [wall, null, null, null, null], [wall, wall, wall, wall, wall]];
    // return [[wall]];
  }
}
