import { Application, Sprite } from "pixi.js";
import assets from "../assets";

export default class App extends Application {
  constructor() {
    super({
      antialias: true,
      autoStart: true,
    });

    const sprite = new Sprite(assets.dirt);
    sprite.width = sprite.height = 128;
    this.stage.addChild(sprite);
  }
}
