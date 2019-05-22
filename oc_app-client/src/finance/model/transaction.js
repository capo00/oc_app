import Category from "./category.js";

export default class Transaction {

  static KEYS = [
    "id", "code", "value", "currency", "date", "account", "accountName", "details", "cc", "vc", "sc", "category"
  ];

  static _buildKeys(fromObject, toObject = {}) {
    this.KEYS.forEach(key => {
      fromObject[key] != null && (toObject[key] = fromObject[key]);
    });
    return toObject;
  };

  constructor(tx) {
    Transaction._buildKeys(tx, this);
    if (typeof this.date === "string") this.date = new Date(this.date);
    !this.category && (this.category = Category.get(this));
  }

  toObject() {
    let tx = this.constructor._buildKeys(this);
    tx.date = tx.date.toISOString().replace(/T.*/, "");
    return tx;
  }

  getCategoryTitle() {
    let cat = Category.CONFIG[this.category];
    return cat ? cat.name : null;
  }
}
