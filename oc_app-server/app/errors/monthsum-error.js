"use strict";
const OcAppUseCaseError = require("./oc-app-use-case-error.js");

const Create = {
  UC_CODE: `${OcAppUseCaseError.ERROR_PREFIX}create/`,

  InvalidDtoInError: class extends OcAppUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  CreateFailedError: class extends OcAppUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}failed`;
      this.message = "Create transaction failed.";
    }
  }
};

module.exports = {
  Create
};
