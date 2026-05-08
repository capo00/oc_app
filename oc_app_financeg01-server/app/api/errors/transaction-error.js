"use strict";

const AppFinanceUseCaseError = require("./app-finance-use-case-error.js");
const TRANSACTION_ERROR_PREFIX = `${AppFinanceUseCaseError.ERROR_PREFIX}transaction/`;

const Import = {
  UC_CODE: `${TRANSACTION_ERROR_PREFIX}import/`,

  InvalidDtoIn: class extends AppFinanceUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Import.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  CreateFailed: class extends AppFinanceUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Import.UC_CODE}createFailed`;
      this.message = "Create transaction failed.";
    }
  },
};

const List = {
  UC_CODE: `${TRANSACTION_ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends AppFinanceUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  Failed: class extends AppFinanceUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}failed`;
      this.message = "List transactions failed.";
    }
  },
};



const Update = {
  UC_CODE: `${TRANSACTION_ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends AppFinanceUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  Failed: class extends AppFinanceUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}failed`;
      this.message = "Update transaction failed.";
    }
  },
};

module.exports = {
  Import,
  List,
  Update,
};
