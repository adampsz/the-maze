import { utils } from "pixi.js";
import { load } from "./assets";

import { Maze } from "./model";
import { App } from "./view";

utils.skipHello();

load().then(() => {
  const app = new App(new Maze(33, 33));

  app.resizeTo = window;
  app.resize();

  document.body.appendChild(app.view);
  document.body.appendChild(app.ui.element);
});
