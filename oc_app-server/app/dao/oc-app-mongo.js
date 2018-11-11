"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class OcAppMongo extends UuObjectDao {

  async createSchema() {
    await super.createIndex({ awid: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id
    };
    return await super.findOne(filter);
  }

  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id
    };
    return await super.findOneAndUpdate(filter, order, "NONE");
  }

  async delete(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id
    };
    return await super.deleteOne(filter);
  }

}

module.exports = OcAppMongo;
