import { utils } from "pixi.js";
import { App } from "./view";

utils.skipHello();

App.instance.then((app) => {
  document.body.appendChild(app.view);
  document.body.appendChild(app.ui.element);
});
