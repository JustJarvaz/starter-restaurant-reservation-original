const convertISOTimeToMinutes = require("./convertISOTimeToMinutes");
const { RESTAURANT_SCHEDULE } = require("./constants");

function generateValidTime() {
  const openTime = convertISOTimeToMinutes(RESTAURANT_SCHEDULE.openTime);
  const almostClosingTime =
    convertISOTimeToMinutes(RESTAURANT_SCHEDULE.closeTime) -
    RESTAURANT_SCHEDULE.closeTimeBuffer;

  const time =
    Math.floor(Math.random() * (almostClosingTime - openTime + 1)) + openTime;

  const hour = Math.floor(time / 60);
  const minutes = time % 60;

  return hour < 12
    ? `${("0" + hour).slice(-2)}:${("0" + minutes).slice(-2)}AM`
    : `${("0" + (hour - 12)).slice(-2)}:${("0" + minutes).slice(-2)}PM`;
}

module.exports = generateValidTime;
