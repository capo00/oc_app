"use strict";
const AppFinanceAbl = require("../../abl/app-finance-abl.js");

class AppFinanceController {
  init(ucEnv) {
    return AppFinanceAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return AppFinanceAbl.load(ucEnv.getUri(), ucEnv.getSession());
  }

  loadBasicData(ucEnv) {
    return AppFinanceAbl.loadBasicData(ucEnv.getUri(), ucEnv.getSession());
  }
}

module.exports = new AppFinanceController();
