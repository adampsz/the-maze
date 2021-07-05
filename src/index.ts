import './index.css';

import { utils } from "pixi.js";
import App from "./App";

utils.skipHello();

App.instance.then((app) => {
  document.body.appendChild(app.view);
  document.body.appendChild(app.ui.element);
});
