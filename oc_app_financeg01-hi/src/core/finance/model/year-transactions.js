import { UuDate } from "uu_i18ng01";
import MonthTransactions, { round } from "./month-transactions.js";

export default class YearTransactions {
  constructor(txs) {
    this.incomes = 0;
    this.costs = 0;
    this.incomesExpected = 0;
    this.costsExpected = 0;

    this.transactions = {};

    txs.forEach((txObject) => {
      let date = new UuDate(txObject.data.date);
      let dateFormatted = date.format(undefined, { format: "YYYY/MM" });
      this.transactions[dateFormatted] = this.transactions[dateFormatted] || [];
      this.transactions[dateFormatted].push(txObject);
    });

    for (let month in this.transactions) {
      let monthTransactions = new MonthTransactions(this.transactions[month]);

      this.incomes += monthTransactions.incomes;
      this.incomesExpected += monthTransactions.incomesExpected;
      this.costs += monthTransactions.costs;
      this.costsExpected += monthTransactions.costsExpected;

      this.transactions[month] = monthTransactions;
    }

    this.incomes = round(this.incomes);
    this.costs = round(this.costs);
    this.incomesExpected = round(this.incomesExpected);
    this.costsExpected = round(this.costsExpected);
    this.difference = round(this.incomes + this.costs);
  }
}
