import { Application, PlaneGeometry } from "pixi.js";

import { Maze } from "../model";
import { load } from "../assets";
import UI from "../ui";

import MazeView from "./MazeView";
import Camera from "./Camera";
import Keyboard from "./Keyboard";

export default class App extends Application {
  model: Maze;

  maze: MazeView;
  ui: UI;

  camera = new Camera();
  keyboard = new Keyboard();

  private constructor(maze: Maze) {
    super({
      antialias: true,
      autoStart: true,
    });

    this.model = maze;

    this.maze = new MazeView(maze);
    this.ui = new UI(maze.player);

    this.stage.addChild(this.maze);
    this.ticker.add(this.tick);

    this.renderer.on("resize", () => {
      const { width, height } = this.renderer;
      this.camera.resize(width, height);
      this.render();
    });
  }

  tick = () => {
    const delta = this.ticker.deltaMS;

    let [x, y, s] = [0, 0, 0];

    if (this.keyboard.any("ArrowLeft", "a")) x -= 1;
    if (this.keyboard.any("ArrowRight", "d")) x += 1;

    if (this.keyboard.any("ArrowUp", "w")) y -= 1;
    if (this.keyboard.any("ArrowDown", "s")) y += 1;

    if (this.keyboard.pressed("=")) s += 1;
    if (this.keyboard.pressed("-")) s -= 1;

    if (this.keyboard.handle("e")) this.ui.inventory.toggle();

    this.model.update(delta / 1000);
    this.model.movePlayer(x, y);

    this.camera.moveTo(...this.model.player.middlePosition());
    this.camera.scaleBy((s * delta) / 300);

    this.camera.update(delta);
    this.stage.scale.set(this.camera.scale);
    this.stage.position.set(this.camera.x, this.camera.y);

    this.maze.update();

    this.ui.update(this.model.player);
  };

  destroy() {
    super.destroy();
    this.keyboard.destroy();
  }

  static async init() {
    await load();

    const app = new App(new Maze(33, 33));
    app.resizeTo = window;
    app.resize();

    return app;
  }

  static instance = App.init();
}
