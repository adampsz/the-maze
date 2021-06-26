import { Application } from "pixi.js";
import { Maze } from "../model";
import MazeView from "./MazeView";

export default class App extends Application {
  view: MazeView;

  camera = new Camera();
  keyboard = new Keyboard();

  constructor(maze: Maze) {
    super({
      antialias: true,
      autoStart: true,
    });

    this.view = new MazeView(this.maze);

    this.stage.addChild(this.view);
    this.ticker.add(this.tick);

    this.renderer.on("resize", () => {
      const { width, height } = this.renderer;
      this.camera.resize(width, height);
      this.render();
    });
  }

  tick = () => {
    const delta = this.ticker.deltaMS;

    let [x, y, z] = [0, 0, 0];

    if (this.keyboard.any("ArrowLeft", "a")) x -= 1;
    if (this.keyboard.any("ArrowRight", "d")) x += 1;

    if (this.keyboard.any("ArrowUp", "w")) y -= 1;
    if (this.keyboard.any("ArrowDown", "s")) y += 1;

    if (this.keyboard.pressed("=")) s += 1;
    if (this.keyboard.pressed("-")) s -= 1;

    if (this.keyboard.handle("e")) this.ui.inventory.toggle();

    this.maze.update(delta / 1000);

    this.camera.moveTo(...this.player.middlePosition());
    this.camera.scaleBy((s * delta) / 300);

    this.camera.update(delta);
    this.stage.scale.set(this.camera.scale);
    this.stage.position.set(this.camera.x, this.camera.y);
  };

  destroy() {
    super.destroy();
    this.keyboard.destroy();
  }
}
