import Item from "./Item";

export default class Key extends Item {
  static total = 0;

  id: number;

  constructor() {
    super("Key");

    Key.total += 1;
    this.id = Key.total;
  }
}
