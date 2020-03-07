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
    };
  }
}

const ACC_I = 0;
const VALUE_I = 1;
const VALUE_I_KB = 4;
const VALUE_I_ORG_KB = 5;
const CURR_I = 2;
const CURR_I_KB = 6;
const DATE_I = 3;
const DATE_I_KB = 0;
const DATE_TEMP_I = 4;
const DATE_TEMP_I_KB = 1;
const BANK_NUM_I = 5;
const BANK_ACC_I = 8;
const BANK_ACC_I_KB = 2;
const BANK_ACC_NAME_I = 9;
const BANK_ACC_NAME_I_KB = 3;
const DETAILS_I_START = 13;
const DETAILS_I_START_KB = 12;
const DETAILS_I_END = 18;
const DETAILS_I_END_KB = 17;
const CONSTANT_CODE_I = 19;
const CONSTANT_CODE_I_KB = 9;
const VARIABLE_CODE_I = 20;
const VARIABLE_CODE_I_KB = 8;
const SPECIFIC_CODE_I = 21;
const SPECIFIC_CODE_I_KB = 10;

function pad(num) {
  return num.length === 1 ? "0" + num : num;
}

function parseDate(date) {
  const parts = date.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  return new Date(parts ? [parts[3], pad(parts[2]), pad(parts[1])].join("-") : date);
}

export default class Balance {

  static _getUCTx(data) {
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
          date: parseDate(row[DATE_I] || row[DATE_TEMP_I]),
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

  static _getKBTx(data) {
    const accountCode = data[3][1].match(/^[0-9-]+/)[0];

    // removed headers
    for (let i = 0; i < 18; i++) {
      data.shift();
    }

    const transactions = [];
    data.forEach(row => {
      if (row.length > DETAILS_I_END_KB + 1) {
        let value = +(row[VALUE_I_KB].replace(/"/g, "").replace(",", "."));
        let tx = new Transaction({
          code: accountCode,
          value: value,
          currency: "CZK",
          date: parseDate(row[DATE_I_KB] || row[DATE_TEMP_I_KB]),
          account: row[BANK_ACC_I_KB].trim(),
          accountName: row[BANK_ACC_NAME_I_KB].trim() || null,
          details: Balance.range(row, DETAILS_I_START_KB, DETAILS_I_END_KB).join("\n"),
          cc: row[CONSTANT_CODE_I_KB].trim().replace(/^0$/, "") || null,
          vc: row[VARIABLE_CODE_I_KB].trim().replace(/^0$/, "") || null,
          sc: row[SPECIFIC_CODE_I_KB].trim().replace(/^0$/, "") || null
        });

        transactions.push(tx);
      }
    });

    return transactions;
  }

  static getTransactions(data) {
    if (data[4][0] !== "IBAN") {
      return Balance._getUCTx(data);
    } else {
      return Balance._getKBTx(data);
    }
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
