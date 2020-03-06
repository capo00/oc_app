import Transaction from "./transaction.js";

class Account {
  constructor(number) {
    this.number = number;
    this.transactions = [];
    this.costs = 0.0;
    this.incomes = 0.0;
  }

  addTransaction(tx) {
    this.transactions.push(tx);
    tx.value < 0 ? this.costs += tx.value : this.incomes += tx.value;
    return this;
  }

  round(value) {
    return Math.round(value * 100) / 100;
  }

  getTransactions(from = null, to = null) {
    let incomes = 0.0;
    let costs = 0.0;
    let incomesExpected = 0.0;
    let costsExpected = 0.0;

    to = to || (from ? new Date() : null);

    let transactions = this.transactions.filter(tx => {
      let con = (!from && !to) || (from <= tx.date && tx.date <= to);

      if (con) {
        if (tx.value < 0) {
          costs += tx.value;

          if (tx.category) {
            costsExpected += tx.value;
          }
        } else {
          incomes += tx.value;

          if (tx.category) {
            incomesExpected += tx.value;
          }
        }
      }

      return con;
    });

    return {
      transactions,
      incomes: this.round(incomes),
      costs: this.round(costs),
      incomesExpected: this.round(incomesExpected),
      costsExpected: this.round(costsExpected)
    }
  }
}

const ACC_I = 0;
const VALUE_I = 1;
const CURR_I = 2;
const DATE_I = 3;
const DATE_TEMP_I = 4;
const BANK_NUM_I = 5;
const BANK_ACC_I = 8;
const BANK_ACC_NAME_I = 9;
const DETAILS_I_START = 13;
const DETAILS_I_END = 18;
const CONSTANT_CODE_I = 19;
const VARIABLE_CODE_I = 20;
const SPECIFIC_CODE_I = 21;

function pad(num) {
  return num.length === 1 ? "0" + num : num;
}

function parseDate(date) {
  const parts = date.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  return [parts[3], pad(parts[2]), pad(parts[1])].join("-");
}

export default class Balance {

  static getTransactions(data) {
    data.shift(); // top
    data.shift(); // header
    data.shift(); // account
    data.shift(); // header of balance

    let transactions = [];
    data.forEach(row => {
      if (row.length > SPECIFIC_CODE_I + 1) {
        let value = +(row[VALUE_I].replace(/"/g, "").replace(",", "."));
        let tx = new Transaction({
          code: row[ACC_I].trim(),
          value: value,
          currency: row[CURR_I].trim(),
          date: new Date(parseDate(row[DATE_I] || row[DATE_TEMP_I])),
          account: /^\d+(?:-\d*)?/.test(row[BANK_ACC_I].trim()) ? [row[BANK_ACC_I].trim(), row[BANK_NUM_I].trim()].join("/") : null,
          accountName: row[BANK_ACC_NAME_I].trim() || null,
          details: Balance.range(row, DETAILS_I_START, DETAILS_I_END).join("\n"),
          cc: row[CONSTANT_CODE_I].trim() || null,
          vc: row[VARIABLE_CODE_I].trim() || null,
          sc: row[SPECIFIC_CODE_I].trim() || null
        });

        transactions.push(tx);
      }
    });

    return transactions;
  }

  static parse(data) {
    let accounts = {};
    data.forEach(tx => {
      let code = tx.code;
      let account = accounts[code] = accounts[code] || new Account(code);
      account.addTransaction(new Transaction(tx));
    });

    return new Balance(accounts);
  }

  static range(array, min, max) {
    let newArray = [];
    let i = min;
    while (i <= max) {
      let value = array[i].trim();
      value && newArray.push(value);
      i++
    }
    return newArray;
  }

  constructor(accounts) {
    this.accounts = accounts;
  }

  get firstAccount() {
    return this.accounts ? this.accounts[Object.keys(this.accounts)[0]] : {};
  }

  get transactions() {
    return this.firstAccount.transactions;
  }

  get incomes() {
    return this.firstAccount.incomes;
  }

  get costs() {
    return this.firstAccount.costs;
  }
}
