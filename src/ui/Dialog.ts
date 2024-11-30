import h from "./h";

export interface DialogAction {
  text: string;
  action: (dialog: Dialog) => void;
}

export default class Dialog {
  element: HTMLElement;
  children: Dialog[] = [];

  constructor(content: string | HTMLElement, ...actions: DialogAction[]) {
    this.element = h(
      ".dialog",
      h(".dialog-backdrop", { click: () => this.close() }),
      h(
        ".dialog-content",
        content,
        h(
          ".dialog-buttons",
          ...actions.map(({ text, action }) =>
            h("button", text, { click: () => action(this) }),
          ),
        ),
      ),
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
    this.children.forEach((child) => child.close());

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

  child(dialog: Dialog): Dialog {
    this.children.push(dialog);
    return dialog;
  }
}
