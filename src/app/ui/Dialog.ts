import h from "./h";

export interface DialogAction {
  text: string;
  action: () => void;
}

export default class Dialog {
  element: HTMLElement;

  constructor(
    content: string | HTMLElement,
    ...actions: (DialogAction & ThisType<Dialog>)[]
  ) {
    this.element = h(
      ".dialog",
      h(".dialog-backdrop", { click: () => this.close() }),
      h(
        ".dialog-content",
        content,
        h(
          ".dialog-buttons",
          ...actions.map(({ text, action }) =>
            h("button", text, { click: () => action.call(this) })
          )
        )
      )
    );
  }

  private esc = (event: KeyboardEvent) => {
    if (event.key == "Escape") this.close();
  };

  get opened() {
    return Boolean(this.element.parentElement);
  }

  open() {
    document.body.appendChild(this.element);
    document.addEventListener("keydown", this.esc);
  }

  close() {
    this.element.parentElement?.removeChild(this.element);
    document.removeEventListener("keydown", this.esc);
  }

  toggle() {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }
}
