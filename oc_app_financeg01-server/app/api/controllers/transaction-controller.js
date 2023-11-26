"use strict";
const TransactionAbl = require("../../abl/transaction-abl.js");

class TransactionController {
  list(ucEnv) {
    return TransactionAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  update(ucEnv) {
    return TransactionAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  import(ucEnv) {
    return TransactionAbl.import(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new TransactionController();
