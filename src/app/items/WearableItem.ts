import Stats from "../Stats";
import Item from "./Item";

export enum Slot {
  helmet = "helmet",
  armor = "armor",
  weapon = "weapon",
  torch = "torch",
}

export default class WearableItem extends Item {
  slot: Slot;
  stats: Stats;

  constructor(name: string, slot: Slot, stats: Stats) {
    super(name);

    this.slot = slot;
    this.stats = stats;
  }
}
