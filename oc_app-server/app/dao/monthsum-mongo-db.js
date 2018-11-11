"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class MonthSumMongoDB extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, month: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ awid, id });
  }

  async delete(awid, id) {
    return await super.deleteOne({ id, awid });
  }
}

module.exports = MonthSumMongoDB;
