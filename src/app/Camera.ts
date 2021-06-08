import { Point, Rectangle } from "pixi.js";
import Spring from "./Spring";

const SPRING_CONFIG = {
  duration: 1000,
  ratio: 1,
};

export default class Camera {
  private view = new Point();

  get scale() {
    const diagonal = Math.hypot(this.view.x, this.view.y);
    return (2 ** this.springs.s.value * diagonal) / 20;
  }

  get x() {
    return this.view.x / 2 - this.springs.x.value * this.scale;
  }

  get y() {
    return this.view.y / 2 - this.springs.y.value * this.scale;
  }

  private springs = {
    x: new Spring(SPRING_CONFIG),
    y: new Spring(SPRING_CONFIG),
    s: new Spring(SPRING_CONFIG, 1),
  };

  moveTo(width: number, height: number) {
    this.springs.x.target = width;
    this.springs.y.target = height;
  }

  scaleBy(amount: number) {
    this.springs.s.target = Math.min(
      Math.max(this.springs.s.target + amount, -2),
      2
    );
  }

  resize(width: number, height: number) {
    this.view.set(width, height);
  }

  update(delta: number) {
    this.springs.x.update(delta);
    this.springs.y.update(delta);
    this.springs.s.update(delta);
  }
}
