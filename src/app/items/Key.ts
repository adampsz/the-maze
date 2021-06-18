import Item from "./Item";

export default class Key extends Item {
  id: number;

  constructor(id: number) {
    super("Key");
    this.id = id;
  }
}
