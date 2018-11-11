"use strict";
const { UseCaseError } = require("uu_appg01_server").AppServer;

class OcAppUseCaseError extends UseCaseError {

  static get ERROR_PREFIX() {
    return "oc-app/";
  }

  constructor(dtoOut, paramMap = {}, cause = null) {
    if (paramMap instanceof Error) {
      cause = paramMap;
      paramMap = {};
    }
    super({ dtoOut, paramMap, status: 400 }, cause);
  }
}

module.exports = OcAppUseCaseError;
