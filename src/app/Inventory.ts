import { Item, Slot, WearableItem } from "./items";

export default class Inventory {
  items: Item[] = [];
  slots: Partial<Record<Slot, Item>> = {};

  collect(item: Item) {
    this.items.push(item);
    this.items.sort((a, b) => +(a.name > b.name) - +(a.name < b.name));
  }

  take(item: Item) {
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
