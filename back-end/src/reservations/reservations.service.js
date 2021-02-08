const knex = require("../db/connection");
const hasProperty = require("../errors/hasProperty");
const compose = require("../utils/compose");
const traceFunction = require("../logging/traceFunction");

const tableName = "reservations";

const validDate = /\d\d\d\d-\d\d-\d\d/;
const validTime = /\d\d:\d\d/;

function peopleIsGreaterThanZero(reservation = {}) {
  const { people } = reservation;
  if (Number.isInteger(people) && people > 0) {
    return reservation;
  }
  const error = new Error(
    `The 'people' property must be a number greater than zero: ${people}`
  );
  error.status = 400;
  throw error;
}

function hasReservationDate(reservation = {}) {
  const { reservation_date = "" } = reservation;
  if (reservation_date.match(validDate)) {
    return reservation;
  }
  const error = new Error(
    `The 'reservation_date' property must be a valid date: '${reservation_date}'`
  );
  error.status = 400;
  throw error;
}

function hasReservationTime(reservation = {}) {
  const { reservation_time = "" } = reservation;
  if (reservation_time.match(validTime)) {
    return reservation;
  }
  const error = new Error(
    `The 'reservation_time property must be a valid time: '${reservation_time}'`
  );
  error.status = 400;
  throw error;
}

function create(newReservation) {
  return knex(tableName)
    .insert(newReservation, "*")
    .then((savedReservations) => savedReservations[0]);
}

function list(date) {
  return knex(tableName)
    .where("reservation_date", date)
    .orderBy("reservation_time");
}

function read(reservation_id) {
  return knex(tableName).where({ reservation_id }).first();
}

const createComposition = compose(
  create,
  peopleIsGreaterThanZero,
  hasReservationTime,
  hasReservationDate,
  hasProperty("mobile_number"),
  hasProperty("last_name"),
  hasProperty("first_name")
);

module.exports = {
  create: traceFunction(createComposition, __filename),
  list: traceFunction(list, __filename),
  read: traceFunction(read, __filename),
};
