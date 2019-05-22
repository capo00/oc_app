import Transaction from "./transaction";

export function round(value) {
  return Math.round(value * 100) / 100;
}

export default class MonthTransactions {
  constructor(txs) {
    this.incomes = 0;
    this.costs = 0;
    this.incomesExpected = 0;
    this.costsExpected = 0;

    this.incomesTransactions = [];
    this.costsTransactions = [];
    this.incomesExpectedTransactions = [];
    this.costsExpectedTransactions = [];
    this.incomesUnexpectedTransactions = [];
    this.costsUnexpectedTransactions = [];

    this.transactions = txs.map(txObject => {
      let tx = new Transaction(txObject);

      if (tx.value > 0) {
        this.incomes += tx.value;
        this.incomesTransactions.push(tx);

        if (tx.category) {
          this.incomesExpected += tx.value;
          this.incomesExpectedTransactions.push(tx);
        } else {
          this.incomesUnexpectedTransactions.push(tx);
        }
      } else if (tx.value < 0) {
        this.costs += tx.value;
        this.costsTransactions.push(tx);

        if (tx.category) {
          this.costsExpected += tx.value;
          this.costsExpectedTransactions.push(tx);
        } else {
          this.costsUnexpectedTransactions.push(tx);
        }
      }

      return tx;
    });

    this.incomes = round(this.incomes);
    this.costs = round(this.costs);
    this.incomesExpected = round(this.incomesExpected);
    this.costsExpected = round(this.costsExpected);
    this.difference = round(this.incomes + this.costs);
  }
}
