import { Application } from "pixi.js";
import Camera from "./Camera";
import Keyboard from "./Keyboard";
import Maze from "./maze";
import Player from "./Player";
import UI from "./ui";

export default class App extends Application {
  player = new Player();
  maze = new Maze(this.player, 2 ** 5 + 1, 2 ** 5 + 1);
  ui = new UI(this.player);

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

    if (this.keyboard.handle("e")) this.ui.inventory.toggle();

    this.player.nextMove = [x, y];

    this.maze.moveEntities(delta / 1000);
    this.maze.updateVisibilityOfBlocks(this.player);

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
