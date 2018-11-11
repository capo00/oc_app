"use strict";
const OcAppModel = require("../models/oc-app-model.js");

class OcAppController {

  init(ucEnv) {
    return OcAppModel.init(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

}

module.exports = new OcAppController();
