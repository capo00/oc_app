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

const CSV_INDEXES = {
  ucb: {
    code: 0,
    value: 1,
    currency: 2,
    date: 3,
    dateTemp: 4,
    accountCode: 5,
    accountNumber: 8,
    accountName: 9,
    detailStart: 13,
    detailEnd: 18,
    cc: 19,
    vc: 20,
    sc: 21,
  },
  kb: {
    value: 4,
    currency: 6,
    date: 0,
    dateTemp: 1,
    account: 2,
    accountName: 3,
    detailStart: 12,
    detailEnd: 17,
    cc: 9,
    vc: 8,
    sc: 10,
  },
  moneta: {
    code: 0,
    value: 7,
    currency: 8,
    date: 5,
    dateTemp: 6,
    accountCode: 3,
    accountNumber: 2,
    accountName: 4,
    detailStart: 12,
    detailEnd: 18,
    cc: 11,
    vc: 9,
    sc: 10,
  },
}

function pad(num) {
  return num.length === 1 ? "0" + num : num;
}

function parseDate(date) {
  const parts = date.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  return new Date(parts ? [parts[3], pad(parts[2]), pad(parts[1])].join("-") : date);
}

export default class Balance {

  static _getUCBTx(data) {
    data.shift(); // top
    data.shift(); // header
    data.shift(); // account
    data.shift(); // header of balance

    const i = CSV_INDEXES.ucb;

    let valueI = i.value;
    let currI = i.currency;
    if (data[0][1] === "CZK") {
      valueI = i.currency;
      currI = i.value;
    }

    let transactions = [];
    data.forEach(row => {
      if (row.length > i.sc + 1) {
        let value = +(row[valueI].replace(/"/g, "").replace(",", "."));
        let code = row[i.code].trim();
        if (data[0][1] === "CZK") {
          code = code.split(/0000+/)[1];
        }

        let tx = new Transaction({
          code,
          value: value,
          currency: row[currI].trim(),
          date: parseDate(row[i.date] || row[i.dateTemp]),
          account: /^\d+(?:-\d*)?/.test(row[i.accountNumber].trim()) ? [row[i.accountNumber].trim(), row[i.accountCode].trim()].join("/") : null,
          accountName: row[i.accountName].trim() || null,
          details: Balance.range(row, i.detailStart, i.detailEnd).join("\n"),
          cc: row[i.cc].trim() || null,
          vc: row[i.vc].trim() || null,
          sc: row[i.sc].trim() || null
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

    const i = CSV_INDEXES.kb;

    const transactions = [];
    data.forEach((row) => {
      if (row.length > i.detailEnd + 1) {
        let value = +(row[i.value].replace(/"/g, "").replace(",", "."));
        let tx = new Transaction({
          code: accountCode,
          value: value,
          currency: "CZK",
          date: parseDate(row[i.date] || row[i.dateTemp]),
          account: row[i.account].trim(),
          accountName: row[i.accountName].trim() || null,
          details: Balance.range(row, i.detailStart, i.detailEnd).join("\n"),
          cc: row[i.cc].trim().replace(/^0$/, "") || null,
          vc: row[i.vc].trim().replace(/^0$/, "") || null,
          sc: row[i.sc].trim().replace(/^0$/, "") || null,
        });

        transactions.push(tx);
      }
    });

    return transactions;
  }

  static _getMonetaTx(data) {
    data.shift();

    const i = CSV_INDEXES.moneta;

    const transactions = [];
    data.forEach((row) => {
      if (row.length > 1) {
        let value = +(row[i.value].replace(/"/g, "").replace(",", "."));
        let tx = new Transaction({
          code: row[i.code].match(/^[0-9-]+/)[0],
          value: value,
          currency: row[i.currency],
          date: parseDate(row[i.date] || row[i.dateTemp]),
          account: row[i.accountNumber] ? [row[i.accountNumber].trim(), row[i.accountCode].trim()].join("/") : null,
          accountName: row[i.accountName].trim() || null,
          details: Balance.range(row, i.detailStart, i.detailEnd).join("\n"),
          cc: row[i.cc].trim().replace(/^0$/, "") || null,
          vc: row[i.vc].trim().replace(/^0$/, "") || null,
          sc: row[i.sc].trim().replace(/^0$/, "") || null,
        });

        transactions.push(tx);
      }
    });

    return transactions;
  }

  static getTransactions(data) {
    if (data[0] && /^Seznam transakcí účtu/.test(data[0][0])) {
      console.log("ucb");
      return Balance._getUCBTx(data);
    } else if (data[4] && data[4][0] === "IBAN") {
      console.log("kb");
      return Balance._getKBTx(data);
    } else {
      console.log("moneta");
      return Balance._getMonetaTx(data);
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
