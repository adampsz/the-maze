import { Application } from "pixi.js";
import Camera from "./Camera";
import Keyboard from "./Keyboard";
import Maze from "./Maze";
import Player from "./Player";

export default class App extends Application {
  player = new Player();
  maze = new Maze(this.player);

  camera = new Camera();
  keyboard = new Keyboard();

  constructor() {
    super({
      antialias: true,
      autoStart: true,
    });

    this.stage.addChild(this.maze);
    this.ticker.add(this.tick);

    this.player.position.set(1, 1);

    this.renderer.on("resize", () => {
      const { width, height } = this.renderer;
      this.camera.resize(width, height);
      this.render();
    });
  }

  tick = () => {
    const delta = this.ticker.deltaMS;

    let x = 0;
    let y = 0;
    let s = 0;

    if (this.keyboard.any("ArrowLeft", "a")) x -= 1;
    if (this.keyboard.any("ArrowRight", "d")) x += 1;

    if (this.keyboard.any("ArrowUp", "w")) y -= 1;
    if (this.keyboard.any("ArrowDown", "s")) y += 1;

    if (this.keyboard.pressed("=")) s += 1;
    if (this.keyboard.pressed("-")) s -= 1;

    this.maze.moveEntity(this.player, (x * delta) / 300, (y * delta) / 300);
    const xMid = this.player.position.x + this.player.width / 2;
    const yMid = this.player.position.y + this.player.height / 2;
    this.camera.moveTo(xMid, yMid);
    this.maze.updateVisibilityOfBlocks(this.player, 10);
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
