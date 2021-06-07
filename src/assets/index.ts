import { Loader, Texture } from "pixi.js";
import * as urls from "./urls";

type Assets = Record<keyof typeof urls, Texture>;

const assets: Assets = {} as Assets;

export default assets;

export function load() {
  return new Promise((resolve, reject) => {
    const loader = new Loader();

    for (const [name, url] of Object.entries(urls)) {
      loader.add({ name, url });
    }

    loader.onError.add(reject);

    loader.load(() => {
      for (const name of Object.keys(urls)) {
        const key = name as keyof Assets;
        assets[key] = loader.resources[key].texture!;
      }

      resolve(assets);
    });
  });
}
