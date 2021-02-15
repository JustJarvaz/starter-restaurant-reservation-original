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
    .update(updatedTable, "*")
    .then((records) => records[0]);
}

function seat(table_id, reservation_id, logger) {
  logger.debug({
    __fileName: __filename,
    methodName: seat.name,
    table_id,
    reservation_id,
  });

  return knex.transaction(async (transaction) => {
    await knex("reservations")
      .where({ reservation_id })
      .update({ status: "seated" })
      .transacting(transaction);

    return knex("tables")
      .where({ table_id })
      .update({ reservation_id }, "*")
      .transacting(transaction)
      .then((records) => records[0]);
  });
}

function finish(table) {
  return knex.transaction(async (transaction) => {
    await knex("reservations")
      .where({ reservation_id: table.reservation_id })
      .update({ status: "finished" })
      .transacting(transaction);

    return knex("tables")
      .where({ table_id: table.table_id })
      .update({ reservation_id: null }, "*")
      .transacting(transaction)
      .then((records) => records[0]);
  });
}

const validTableComposition = compose(
  capacityIsGreaterThanZero,
  hasMinLength("table_name", 2),
  hasProperty("table_name")
);

const createComposition = compose(create, validTableComposition);

const updateComposition = compose(update, validTableComposition);

module.exports = {
  create: traceFunction(createComposition, __filename),
  finish: traceFunction(finish, __filename),
  list: traceFunction(list, __filename),
  read: traceFunction(read, __filename),
  seat,
  update: traceFunction(updateComposition, __filename),
};
