import { Application } from "pixi.js";
import Keyboard from "./Keyboard";
import Maze from "./Maze";
import Player from "./Player";

export default class App extends Application {
  player = new Player();
  maze = new Maze(this.player);

  keyboard = new Keyboard();

  constructor() {
    super({
      antialias: true,
      autoStart: true,
    });

    this.stage.addChild(this.maze);
    this.ticker.add(this.tick);

    this.renderer.on("resize", () => {
      this.render();

      const { width, height } = this.renderer;
      const diagonal = Math.hypot(width, height);
      const size = 400;

      this.stage.scale.set(diagonal / size);
      this.stage.position.set(width / 2, height / 2);
    });
  }

  tick = (delta: number) => {
    let x = 0;
    let y = 0;

    if (this.keyboard.any("ArrowLeft", "a")) x -= 1;
    if (this.keyboard.any("ArrowRight", "d")) x += 1;
    if (this.keyboard.any("ArrowUp", "w")) y -= 1;
    if (this.keyboard.any("ArrowDown", "s")) y += 1;

    this.maze.moveEntity(this.player, (x * delta) / 20, (y * delta) / 20);
  };

  destroy() {
    super.destroy();
    this.keyboard.destroy();
  }
}
