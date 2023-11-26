"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/transaction-error.js");

const WARNINGS = {
  importUnsupportedKeys: {
    code: `${Errors.Import.UC_CODE}unsupportedKeys`,
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
  },
};

class TransactionAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("transaction");
  }

  async import(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("importDtoInType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.importUnsupportedKeys.code,
      Errors.Import.InvalidDtoIn
    );

    let dtoOut = { data: [] };
    try {
      for (let tx of dtoIn.data) {
        tx.awid = awid;
        let txDtoOut = await this.dao.create(tx);
        dtoOut.data.push(txDtoOut);
      }
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Import.CreateFailed({ uuAppErrorMap }, e);
      } else {
        throw e;
      }
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async list(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("listDtoInType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.importUnsupportedKeys.code,
      Errors.List.InvalidDtoInError
    );

    dtoIn.pageInfo ||= {};
    dtoIn.pageInfo.pageIndex ||= 0;
    dtoIn.pageInfo.pageSize ||= 1000;

    let dtoOut;
    try {
      dtoOut = await this.dao.list(awid, dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.List.Failed({ uuAppErrorMap }, e);
      } else {
        throw e;
      }
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async update(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("updateDtoInType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    const { id, ...restDtoIn } = dtoIn;

    let dtoOut;
    try {
      dtoOut = await this.dao.update({ awid, id }, restDtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Update.Failed({ uuAppErrorMap }, e);
      } else {
        throw e;
      }
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new TransactionAbl();
