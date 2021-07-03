import { Item, Slot, WearableItem } from "./items";

export default class Inventory {
  private items: Item[] = [];
  private slots: Partial<Record<Slot, WearableItem>> = {};

  contents() {
    return this.items;
  }

  equipped() {
    return Object.values(this.slots);
  }

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

  find(pred: (item: Item) => boolean) {
    return this.items.find(pred);
  }
}
