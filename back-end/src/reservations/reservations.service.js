const knex = require("../db/connection");
const hasProperty = require("../errors/hasProperty");
const compose = require("../utils/compose");
const convertISOTimeToMinutes = require("../utils/convertISOTimeToMinutes");
const traceFunction = require("../logging/traceFunction");
const {
  ERROR_MESSAGES,
  RESTAURANT_SCHEDULE,
  WEEKDAYS,
} = require("./reservations.constants.js");

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

function isFutureDate(reservation) {
  const { reservation_date, reservation_time } = reservation;

  if (new Date(`${reservation_date} ${reservation_time}`) > new Date()) {
    return reservation;
  }
  const error = new Error(ERROR_MESSAGES.invalidDate);
  error.status = 400;
  throw error;
}

function isWorkingDay(reservation) {
  const { reservation_date = "" } = reservation;
  const day = new Date(date).getUTCDay();
  if (RESTAURANT_SCHEDULE.closedDays.includes(day)) {
    const error = new Error(ERROR_MESSAGES.invalidDay);
    error.status = 400;
    throw error;
  }
  return reservation;
}

function isWithinEligibleTimeframe(reservation) {
  let { reservation_time = "" } = reservation;
  reservation_time = convertISOTimeToMinutes(time);
  if (
    reservation_time < convertISOTimeToMinutes(RESTAURANT_SCHEDULE.openTime) ||
    reservation_time >
      convertISOTimeToMinutes(RESTAURANT_SCHEDULE.closeTime) -
        RESTAURANT_SCHEDULE.closeTimeBuffer
  ) {
    const error = new Error(ERROR_MESSAGES.invalidTime);
    error.status = 400;
    throw error;
  }

  return reservation;
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
  isWithinEligibleTimeframe,
  isWorkingDay,
  isFutureDate,
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
