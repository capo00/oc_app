"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;

const path = require("path");
const Errors = require("../errors/transaction-error.js");

const WARNINGS = {
  importUnsupportedKeys: {
    code: `${Errors.Import.UC_CODE}unsupportedKeys`
  },
  searchUnsupportedKeys: {
    code: `${Errors.Search.UC_CODE}unsupportedKeys`
  }
};

class TransactionModel {
  constructor() {
    this.validator = new Validator(path.join(__dirname, "..", "validation-types", "transaction-types.js"));
    this.dao = DaoFactory.getDao("transaction");
  }

  async init(awid, dtoIn, uuAppErrorMap = {}) {
    this.dao.createSchema();
    return {};
  }

  async import(awid, dtoIn) {
    let validationResult = this.validator.validate("importDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(dtoIn, validationResult,
      WARNINGS.importUnsupportedKeys.code, Errors.Import.InvalidDtoInError);

    let dtoOut = {data: []};
    try {
      for(let tx of dtoIn.data) {
        tx.awid = awid;
        let txDtoOut = await this.dao.create(tx);
        dtoOut.data.push(txDtoOut);
      }
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Import.CreateFailedError({ uuAppErrorMap }, e);
      } else {
        throw e;
      }
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async search(awid, dtoIn) {
    let validationResult = this.validator.validate("searchDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(dtoIn, validationResult,
      WARNINGS.searchUnsupportedKeys.code, Errors.Search.InvalidDtoInError);

    dtoIn.pageInfo = dtoIn.pageInfo || {};
    dtoIn.pageInfo.pageIndex = dtoIn.pageInfo.pageIndex || 0;
    dtoIn.pageInfo.pageSize = dtoIn.pageInfo.pageSize || 1000;

    let dtoOut;
    try {
      dtoOut = await this.dao.search(awid, dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Search.FailedError({ uuAppErrorMap }, e);
      } else {
        throw e;
      }
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new TransactionModel();
