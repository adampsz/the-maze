import { Point } from "pixi.js";
import Spring from "./Spring";

const SPRING_CONFIG = {
  duration: 1000,
  ratio: 1,
};

/**
 * Kamera - odpowiedzialna za widok labiryntu.
 */
export default class Camera {
  private view = new Point();

  /**
   * Skala. Oznacza ona iloraz wymiarów ekranu do wymiarów labiryntu.
   */
  get scale() {
    const diagonal = Math.hypot(this.view.x, this.view.y);
    return (2 ** this.springs.s.value * diagonal) / 20;
  }

  /**
   * Współrzędna x kamery (we współrzędnych ekranu).
   */
  get x() {
    return this.view.x / 2 - this.springs.x.value * this.scale;
  }

  /**
   * Współrzędna y kamery (we współrzędnych ekranu).
   */
  get y() {
    return this.view.y / 2 - this.springs.y.value * this.scale;
  }

  private springs = {
    x: new Spring(SPRING_CONFIG),
    y: new Spring(SPRING_CONFIG),
    s: new Spring(SPRING_CONFIG, -2),
  };

  /**
   * Przesuwa kamerę na nową pozycję (we współrzędnych labiryntu).
   */
  moveTo(x: number, y: number) {
    this.springs.x.target = x;
    this.springs.y.target = y;
  }

  /**
   * Zwiększą bądź zmniejsza skalę o daną wartość.
   */
  scaleBy(amount: number) {
    this.springs.s.target = Math.min(
      Math.max(this.springs.s.target + amount, -2),
      2
    );
  }

  /**
   * Zmienia rozmiar ekranu.
   */
  resize(width: number, height: number) {
    this.view.set(width, height);
  }

  /**
   * Aktualizuje stan kamery.
   * @param delta Czas (w ms) od ostatniej aktualizacji.
   */
  update(delta: number) {
    this.springs.x.update(delta);
    this.springs.y.update(delta);
    this.springs.s.update(delta);
  }
}
