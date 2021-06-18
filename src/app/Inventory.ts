import { Item, Slot, WearableItem } from "./items";
import { Key } from "./items";

export default class Inventory {
  items: Item[] = [];
  slots: Partial<Record<Slot, Item>> = {};

  constructor() {
    this.collect(new Key());
    this.collect(new WearableItem("Torch 1", Slot.torch));
    this.collect(new WearableItem("Torch 2", Slot.torch));
  }

  collect(item: Item) {
    this.items.push(item);
    this.items.sort((a, b) => +(a.name > b.name) - +(a.name < b.name));
  }

  drop(item: Item) {
    if (item instanceof WearableItem) this.unequip(item);
    this.items = this.items.filter((other) => other != item);
  }

  equip(item: WearableItem) {
    this.slots[item.slot] = item;
  }

  unequip(item: WearableItem) {
    if (this.slots[item.slot] == item) delete this.slots[item.slot];
  }
}
