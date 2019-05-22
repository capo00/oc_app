"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TransactionMongoDB extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, date: 1 });
  }

  async search(awid, search) {
    return await super.find(
      { awid: awid, date: { "$gte": search.dateFrom, "$lte": search.dateTo } },
      search.pageInfo,
      { date: 1 }
    );
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ awid, id });
  }

  async update(awid, id, uuObject) {
    return await super.findOneAndUpdate({ awid, id }, uuObject, "NONE");
  }

  async delete(awid, id) {
    return await super.deleteOne({ id, awid });
  }

  async list(awid, pageInfo = {}, sort = {}) {
    return await super.find({ awid }, pageInfo, sort);
  }
}

module.exports = TransactionMongoDB;
