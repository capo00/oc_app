"use strict";
const OcAppUseCaseError = require("./oc-app-use-case-error.js");

const Import = {
  UC_CODE: `${OcAppUseCaseError.ERROR_PREFIX}import/`,

  InvalidDtoInError: class extends OcAppUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Import.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  CreateFailedError: class extends OcAppUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Import.UC_CODE}failed`;
      this.message = "Create transaction failed.";
    }
  }
};

const Search = {
  UC_CODE: `${OcAppUseCaseError.ERROR_PREFIX}search/`,

  InvalidDtoInError: class extends OcAppUseCaseError {
    constructor() {
      super(...arguments);
      this.message = "DtoIn is not valid.";
      this.code = `${Search.UC_CODE}invalidDtoIn`;
    }
  },

  FailedError: class extends OcAppUseCaseError {
    constructor() {
      super(...arguments);
      this.message = "Search transactions failed.";
      this.code = `${Search.UC_CODE}failed`;
    }
  }
};

module.exports = {
  Import,
  Search
};
