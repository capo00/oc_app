"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;

const path = require("path");
const Errors = require("../errors/monthsum-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  },
};

class MonthSumModel {
  constructor() {
    this.validator = new Validator(path.join(__dirname, "..", "validation-types", "monthsum-types.js"));
    this.dao = DaoFactory.getDao("monthsum");
  }

  async init(awid, dtoIn, uuAppErrorMap = {}) {
    this.dao.createSchema();
    return {};
  }

  async create(awid, dtoIn) {
    let validationResult = this.validator.validate("createDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(dtoIn, validationResult,
      WARNINGS.createUnsupportedKeys.code, Errors.Create.InvalidDtoInError);

    let data = dtoIn.data;
    data.awid = awid;
    return await this.dao.create(data);
  }
}

module.exports = new MonthSumModel();
