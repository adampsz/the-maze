import { Item, Slot, WearableItem } from "./items";
import { Entity } from "./entities";

export default class Inventory {
  private items: Item[] = [];
  private slots: Partial<Record<Slot, WearableItem>> = {};

  // TODO: Tylko do aktualizowania statystyk. Może lepiej inaczej?
  private owner?: Entity;

  constructor(owner?: Entity) {
    this.owner = owner;
  }

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
    this.owner?.updateStats();
  }

  unequip(item: WearableItem) {
    if (this.slots[item.slot] == item) delete this.slots[item.slot];
    this.owner?.updateStats();
  }

  find(pred: (item: Item) => boolean) {
    return this.items.find(pred);
  }
}
