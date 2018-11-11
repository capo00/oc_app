class Account {
  constructor(number) {
    this.number = number;
    this.payments = [];
    this.costs = 0.0;
    this.incomes = 0.0;
  }

  addPayment(payment) {
    this.payments.push(payment);
    payment.value < 0 ? this.costs += payment.value : this.incomes += payment.value;
    return this;
  }

  getPayments(from = null, to = null) {
    let incomes = 0.0;
    let costs = 0.0;
    let incomesExpected = 0.0;
    let costsExpected = 0.0;

    to = to || (from ? new Date() : null);

    let payments = this.payments.filter(payment => {
      let con = (!from && !to) || (from <= payment.date && payment.date <= to);

      if (con) {
        if (payment.value < 0) {
          costs += payment.value;

          if (payment.isExpectedCost) {
            costsExpected += payment.value;
          }
        } else {
          incomes += payment.value;

          if (payment.isExpectedIncome) {
            incomesExpected += payment.value;
          }
        }
      }

      return con;
    });

    return { payments, incomes, costs, incomesExpected, costsExpected }
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

export default class Balance {

  static isExpectedIncome(tx) {
    let result = false;
    let amount = tx.value;

    if (
      // work vigour || college || USO
      ([/^35-2151040287\/0?100$/, /^35-2147930287\/0?100$/, /^51-441400237\/0?100$/].find(r => r.test(tx.account))) ||

      // mom tariff
      (/^19-6302630267\/0?100$/.test(tx.account) && amount === 150) ||

      // Petra tariff
      (/^107-2704330277\/0?100$/.test(tx.account) && (amount === 299 || amount === 550)) ||

      // Aleš tariff
      (/^214354146\/0?600$/.test(tx.account) && (amount === 299 || amount === 550)) ||

      // David tariff
      (/^2862765073\/0?800$/.test(tx.account) && amount === 129 || amount === 149) ||

      // Jana tariff
      (/^933401113\/0?800$/.test(tx.account) && amount === 149) ||

      // rent Střížkov - VS
      (/VS:31310/.test(tx.details) && amount === 18000)
    ) {
      result = true;
    }

    return result;
  }

  static isExpectedCost(tx) {
    let result = false;

    if (
      // Pioneer Investment
      (/^2120710073\/2700$/ && tx.vc === "2300013088") ||

      // Pension
      (/^3033\/2700$/ && tx.vc === "3001296185") ||

      // Aegon - life insurance
      (/^2043980407\/2600$/ && tx.vc === "3300725783") ||

      // Allegro - family insurance
      (/^100001\/2700$/ && tx.vc === "9644079507") ||

      // hypothec
      (!tx.account && (/^PL:/.test(tx.details) || /^SPRÁVA ÚVĚRU/.test(tx.details))) ||

      // Střížkov - fees
      (/^188828116\/0?300$/ && tx.vc === "401031006") ||

      // Střížkov - gas and electric
      (/^19-2784000277\/0?100$/ && (tx.vc === "70006610" || tx.vc === "21234618")) ||

      // Střížkov - UPC
      ((/^3983815\/0?300$/ && tx.vc === "49887991") || /^UPC/.test(tx.accountName)) ||

      // KH - rent
      (/^115-402470267\/0?100$/ && tx.vc === "39103")

    ) {
      result = true;
    }

    return result;
  }

  static getTransactions(data) {
    data.shift(); // header
    data.shift(); // account
    data.shift(); // header of balance

    let transactions = [];
    data.forEach(row => {
      if (row.length > SPECIFIC_CODE_I + 1) {
        let value = +(row[VALUE_I].replace(/"/g, "").replace(",", "."));
        let tx = {
          code: row[ACC_I].trim(),
          value: value,
          currency: row[CURR_I].trim(),
          date: new Date(row[DATE_I] || row[DATE_TEMP_I]).toISOString().replace(/T.*/, ""),
          account: /^\d+(?:-\d*)?/.test(row[BANK_ACC_I].trim()) ? [row[BANK_ACC_I].trim(), row[BANK_NUM_I].trim()].join("/") : null,
          accountName: row[BANK_ACC_NAME_I].trim() || null,
          details: Balance.range(row, DETAILS_I_START, DETAILS_I_END).join("\n"),
          cc: row[CONSTANT_CODE_I].trim() || null,
          vc: row[VARIABLE_CODE_I].trim() || null,
          sc: row[SPECIFIC_CODE_I].trim() || null
        };

        tx.isExpected = value > 0 ? Balance.isExpectedIncome(tx) : Balance.isExpectedCost(tx);

        // let category = Balance.getCategory(tx);
        // category && (tx.category = category);

        transactions.push(tx);
      }
    });

    return transactions;
  }

  static parse(data) {
    let accounts = {};
    data.forEach(tx => {
      tx = Object.assign({}, tx);
      let code = tx.code;
      let isExpectedIncome = tx.isExpected && tx.value > 0;
      let isExpectedCost = isExpectedIncome ? false : tx.isExpected && tx.value < 0;

      tx.date = new Date(tx.date);
      tx.isExpectedIncome = isExpectedIncome;
      tx.isExpectedCost = isExpectedCost;

      let account = accounts[code] = accounts[code] || new Account(code);
      account.addPayment(tx);
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

  get payments() {
    return this.firstAccount.payments;
  }

  get incomes() {
    return this.firstAccount.incomes;
  }

  get costs() {
    return this.firstAccount.costs;
  }
}
