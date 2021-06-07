import { utils } from "pixi.js";
import App from "./app";
import { load } from "./assets";

utils.skipHello();

load().then(() => {
  const app = new App();

  app.resizeTo = window;
  app.resize();
  document.body.appendChild(app.view);

  const resize = app.resize;
  app.resize = () => {
    resize.call(app);
    app.render();
  };
});
