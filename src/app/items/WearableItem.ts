import Item from "./Item";

export enum Slot {
  helmet = "helmet",
  armor = "armor",
  weapon = "weapon",
  torch = "torch",
}

export default class WearableItem extends Item {
  slot: Slot;

  constructor(name: string, slot: Slot) {
    super(name);
    this.slot = slot;
  }
}
