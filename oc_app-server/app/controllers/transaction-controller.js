"use strict";
const TransactionModel = require("../models/transaction-model.js");

class TransactionController {
  import(ucEnv) {
    return TransactionModel.import(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  search(ucEnv) {
    return TransactionModel.search(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  migration1_updateMonth(ucEnv) {
    return TransactionModel.migration1_updateMonth(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new TransactionController();
