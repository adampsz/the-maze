import { Container, Sprite, Point } from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";
import LightMap from "./LightMap";
import { getTexture } from "../assets";
import { Maze, Entity } from "../model";
import EntityView from "./EntityView";

export default class MazeView extends Container {
  #model: Maze;

  #container = new Container();
  #entities: Map<number, EntityView>;
  #tilemap: CompositeTilemap;
  #lightmap: LightMap;

  readonly #SCALE = 64;

  constructor(maze: Maze) {
    super();

    this.#model = maze;

    this.#entities = new Map();
    this.#tilemap = new CompositeTilemap();
    this.#tilemap.scale.set(1 / this.#SCALE);
    this.#lightmap = new LightMap(this.#model.width, this.#model.height);

    this.addChild(this.#tilemap);
    this.addChild(this.#container);
    this.addChild(this.#lightmap);

    this.mask = this.#lightmap;

    // Hack: naprawia interakcję
    Object.assign(this.#tilemap, {
      interactive: true,
      containsPoint: () => true,
    });

    this.#tilemap.on("click", (event) => {
      const global = event.data.global as Point;
      const local = this.#tilemap.worldTransform.applyInverse(global);

      this.#model.blockAction(
        Math.floor(local.x / this.#SCALE),
        Math.floor(local.y / this.#SCALE)
      );

      this.updateTilemap();
    });

    this.updateTilemap();
    this.updateEntities(0);
    this.updateLightmap();
  }

  update(delta: number) {
    this.updateEntities(delta);
    this.updateLightmap();
  }

  private updateTilemap() {
    this.#tilemap.clear();

    this.#model.blocks.forEach((row, y) =>
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

    const { player } = this.#model;

    this.#lightmap.enlightenArea(
      this.#model.blocks,
      ...player.arrayPosition(),
      player.stat("view")
    );

    this.#lightmap.update();
  }

  private updateEntities(delta: number) {
    this.#entities.forEach((entity, id) => {
      entity.update(delta);

      if (entity.dead) this.removeEntity(id);
      else entity.dead = true;
    });

    this.#model.entities.forEach((entity) => {
      const sprite = this.#entities.get(entity.id);

      if (sprite) sprite.dead = false;
      else this.addEntity(entity);
    });
  }

  private addEntity(entity: Entity) {
    const sprite = new EntityView(entity);

    this.#entities.set(entity.id, sprite);
    this.#container.addChild(sprite);

    sprite.on("click", () => {
      this.#model.entityAction(entity.id);
    });
  }

  private removeEntity(id: number) {
    this.#entities.get(id)?.destroy();
    this.#entities.delete(id);
  }
}
