import Player from "../Player";
import { Key } from "../items";

import ActionBlock from "./ActionBlock";

export default class DoorBlock extends ActionBlock {
  id: number;
  opened: boolean = false;

  lightIntensity = 0;

  constructor(id: number) {
    super();
    this.id = id;
  }

  get isWall() {
    return !this.opened;
  }

  get lightTransparent() {
    return this.opened;
  }

  get texture() {
    return this.opened ? "floor" : "dirt";
  }

  action(player: Player) {
    if (this.opened) return;

    const key = player.inventory.find(
      (item) => item instanceof Key && item.id === this.id
    );

    if (key) {
      player.inventory.take(key);
      this.opened = true;
    }
  }
}
