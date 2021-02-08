const convertISOTimeToMinutes = require("./convertISOTimeToMinutes");
const { RESTAURANT_SCHEDULE } = require("./constants");

const INVALID_TIMES = {
  tooEarly: "tooEarly",
  tooLate: "tooLate",
  almostClosing: "almostClosing",
};

function generateInvalidTime(type, offset = 35) {
  let time;
  switch (type) {
    case INVALID_TIMES.tooEarly:
      time = convertISOTimeToMinutes(RESTAURANT_SCHEDULE.openTime) - offset;
      break;
    case INVALID_TIMES.tooLate:
      time = convertISOTimeToMinutes(RESTAURANT_SCHEDULE.closeTime) + offset;
      break;
    case INVALID_TIMES.almostClosing:
      time =
        convertISOTimeToMinutes(RESTAURANT_SCHEDULE.closeTime) -
        RESTAURANT_SCHEDULE.closeTimeBuffer +
        offset;
      break;
    default:
      break;
  }

  const hour = Math.floor(time / 60);
  const minutes = time % 60;

  return hour < 12
    ? `${("0" + hour).slice(-2)}:${("0" + minutes).slice(-2)}AM`
    : `${("0" + (hour - 12)).slice(-2)}:${("0" + minutes).slice(-2)}PM`;
}

module.exports = { INVALID_TIMES, generateInvalidTime };
