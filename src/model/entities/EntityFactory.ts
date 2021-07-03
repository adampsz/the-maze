import Archer from "./Archer";
import Monster from "./Monster";
import Thief from "./Thief";

export default class EntityFactory {
  private id = 1;

  spawn(x: number, y: number) {
    this.id += 1;

    switch (Math.floor(Math.random() * 3)) {
      case 0:
        return new Thief(this.id, x, y);
      case 1:
        return new Archer(this.id, x, y);
      case 2:
      default:
        return new Monster(this.id, x, y);
    }
  }
}
