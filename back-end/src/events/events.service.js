const knex = require("../db/connection");
const traceFunction = require("../logging/traceFunction");

const tableName = "events";

function list() {
  return knex(tableName);
}

module.exports = {
  list: traceFunction(list, __filename),
};
