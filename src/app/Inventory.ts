import Item from "./items/Item";

export default class Inventory {
  private _inventory: Item[] = new Array();

  public get inventory(): Item[] {
    return this._inventory;
  }

  public addItem(item: Item) {
    this._inventory.push(item);
  }
}
