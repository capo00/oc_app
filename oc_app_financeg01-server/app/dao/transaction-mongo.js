"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TransactionMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, date: 1 });
  }

  create(uuObject) {
    return super.insertOne(uuObject);
  }

  list(awid, search) {
    const dtoIn = { awid: awid, date: { $gte: search.dateFrom, $lte: search.dateTo } };
    if (search.category) dtoIn.category = search.category;
    if (search.code) dtoIn.code = search.code;
    return super.find(dtoIn, search.pageInfo, { date: 1 });
  }

  update(filter, uuObject) {
    return super.findOneAndUpdate(filter, uuObject, "NONE");
  }
}

module.exports = TransactionMongo;
