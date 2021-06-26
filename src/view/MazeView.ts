import { Container, Sprite, Point, Texture } from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";
import LightMap from "./LightMap";
import { getTexture } from "../assets";
import { Maze, Entity } from "../model";

export default class MazeView extends Container {
  #maze: Maze;

  #container = new Container();
  #entities: Map<number, Sprite>;
  #tilemap: CompositeTilemap;
  #lightmap: LightMap;

  readonly #SCALE = 16;

  constructor(maze: Maze) {
    super();

    this.#maze = maze;

    this.#entities = new Map();
    this.#tilemap = new CompositeTilemap();
    this.#tilemap.scale.set(1 / this.#SCALE);
    this.#lightmap = new LightMap(this.#maze.width, this.#maze.height);

    this.addChild(this.#tilemap);
    this.addChild(this.#container);
    this.addChild(this.#lightmap);

    this.mask = this.#lightmap;

    // Hack: naprawia interakcję
    Object.assign(this.#tilemap, {
      interactive: true,
      containsPoint: () => true,
    });

    this.#tilemap.on("mousedown", (event) => {
      const global = event.data.global as Point;
      const local = this.#tilemap.worldTransform.applyInverse(global);

      this.#maze.blockAction(
        Math.floor(local.x / this.#SCALE),
        Math.floor(local.y / this.#SCALE)
      );
    });

    this.updateTilemap();
  }

  private updateTilemap() {
    this.#tilemap.clear();

    this.#maze.blocks.forEach((row, y) =>
      row.forEach((block, x) => {
        const texture = getTexture(block.texture);
        this.#tilemap.tile(texture, x * this.#SCALE, y * this.#SCALE, {
          tileWidth: this.#SCALE,
          tileHeight: this.#SCALE,
        });
      })
    );
  }

  private updateLightmap() {
    this.#lightmap.reset();

    const { player } = this.#maze;

    this.#lightmap.enlightenArea(
      this.maze.blocks,
      ...player.arrayPosition(),
      player.stats.get("view")
    );

    this.#lightmap.update();
  }

  private updateEntities() {
    this.#maze.entities.forEach((entity) => {
      const sprite = this.#entities.get(entity.id);

      if (sprite) {
        sprite.position.set(entity.x, entity.y);
      } else {
        this.addEntity(entity);
      }
    });
  }

  private addEntity(entity: Entity) {
    let sprite = new Sprite(getTexture(entity.texture));

    sprite.width = sprite.height = entity.size;
    sprite.position.set(entity.x, entity.y);

    this.#entities.set(entity.id, sprite);
  }

  private removeEntity(id: number) {
    this.#entities.get(id)?.destroy();
    this.#entities.delete(id);
  }
}
