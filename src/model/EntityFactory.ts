import { Entity } from "./entities";

export default class EntityFactory {
  #entityId: number;

  constructor() {
    this.#entityId = 0;
  }

  spawnEntity() {
    this.#entityId += 1;
    return /* new Entity(this.#entityId) */;
  }
}
