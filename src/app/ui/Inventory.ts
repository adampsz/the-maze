import Dialog from "./Dialog";

export default class Inventory extends Dialog {
  constructor() {
    super("Ekwipunek", {
      text: "Ok",
      action() {
        this.close();
      },
    });
  }
}
