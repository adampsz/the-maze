import h from "./h";

import { urls } from "../../assets";

export interface Bars {
  health: number;
  armor: number;
}

export default class Stats {
  element: HTMLElement;

  private health = h(".bar.health");
  private armor = h(".bar.armor");

  constructor() {
    this.element = h(
      ".stats",
      h("img.avatar", { src: urls.dirt }),
      h(".bars", this.health, this.armor)
    );
  }

  update(bars: Bars) {
    this.health.style.width = `${bars.health * 100}%`;
    this.armor.style.width = `${bars.armor * 100}%`;
  }
}
