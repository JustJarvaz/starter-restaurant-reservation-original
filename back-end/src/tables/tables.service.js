const knex = require("../db/connection");
const hasProperty = require("../errors/hasProperty");
const compose = require("../utils/compose");
const traceFunction = require("../logging/traceFunction");
const hasMinLength = require("../errors/hasMinLength");

const tableName = "tables";

function capacityIsGreaterThanZero(table = {}) {
  const { capacity } = table;
  if (Number.isInteger(capacity) && capacity > 0) {
    return table;
  }
  const error = new Error(
    `The 'capacity' property must be a number greater than zero: ${capacity}`
  );
  error.status = 400;
  throw error;
}

function create(newTable) {
  return knex(tableName)
    .insert(newTable, "*")
    .then((savedTables) => savedTables[0]);
}

function list() {
  return knex(tableName).orderBy("table_name");
}

function read(table_id) {
  return knex(tableName).where({ table_id }).first();
}

function update(updatedTable) {
  return knex(tableName)
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*");
}

const createComposition = compose(
  create,
  capacityIsGreaterThanZero,
  hasMinLength("table_name", 2),
  hasProperty("table_name")
);

module.exports = {
  create: traceFunction(createComposition, __filename),
  list: traceFunction(list, __filename),
  read: traceFunction(read, __filename),
  update: traceFunction(update, __filename),
};
