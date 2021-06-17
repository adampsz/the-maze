export interface Attributes {
  [key: string]: string | number | (() => void);
}

export default function h(
  name: string,
  ...props: (string | HTMLElement | Attributes)[]
) {
  let id: string | null = null;
  let classes: string[] = [];

  let tag = name.replace(/[.#]([^.#]*)/g, (match, part) => {
    if (match[0] == "#") id = part;
    else classes.push(part);
    return "";
  });

  const node = document.createElement(tag || "div");

  if (id) node.setAttribute("id", id);
  classes.forEach((cls) => node.classList.add(cls));

  for (let prop of props) {
    if (typeof prop == "string") {
      node.appendChild(document.createTextNode(prop));
    } else if (prop instanceof HTMLElement) {
      node.appendChild(prop);
    } else {
      for (let [name, value] of Object.entries(prop))
        if (typeof value == "function") {
          node.addEventListener(name, value);
        } else {
          node.setAttribute(name, String(value));
        }
    }
  }

  return node;
}
