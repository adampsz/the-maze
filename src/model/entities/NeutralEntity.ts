import Entity from "./Entity";

export default class NeutralEntity extends Entity {
  constructor(id: number, x: number, y: number) {
    super(id, "dirt");
    this.x = x;
    this.y = y;
    this.defaultTarget = [x, y];
    this.stats.add({ speed: 0.8 });
  }

  action(): void {}
}
