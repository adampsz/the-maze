import { Sprite } from "pixi.js";
import { Entity } from "../model";
import { getTexture } from "../assets";

export default class EntityView extends Sprite {
  model: Entity;

  health = 0;
  damaged = 0;
  dead = false;

  constructor(entity: Entity) {
    super(getTexture(entity.texture));

    this.model = entity;

    this.width = entity.width;
    this.height = entity.height;
    this.position.set(entity.x, entity.y);

    this.interactive = true;
  }

  update(delta: number) {
    if (this.damaged > 0) this.damaged -= delta;
    if (this.health > this.model.stat("health")) this.damaged = 0.2;

    if (this.model.nextMove[0] < 0 && this.scale.x > 0) {
      this.anchor.x = 1;
      this.scale.x = -Math.abs(this.scale.x);
    } else if (this.model.nextMove[0] > 0 && this.scale.x < 0) {
      this.anchor.x = 0;
      this.scale.x = Math.abs(this.scale.x);
    }

    this.health = this.model.stat("health");
    this.position.set(this.model.x, this.model.y);

    this.tint = this.damaged > 0 ? 0xff8888 : 0xffffff;
    this.alpha = this.dead ? 0.3 : 1;
  }
}
