import { Application } from "pixi.js";
import Maze from "./Maze";

export default class App extends Application {
  maze: Maze;

  constructor() {
    super({
      antialias: true,
      autoStart: true,
    });

    this.maze = new Maze();
    this.stage.addChild(this.maze);

    this.renderer.on("resize", () => {
      this.render();

      const { width, height } = this.renderer;
      const diagonal = Math.hypot(width, height);
      const size = 400;

      this.stage.scale.set(diagonal / size);
      this.stage.position.set(width / 2, height / 2);
    });
  }
}
