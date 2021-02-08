const { RESTAURANT_SCHEDULE } = require("./constants");

function generateNextDate(working = true) {
  const closedDays = new Set(RESTAURANT_SCHEDULE.closedDays);
  const nextDate = new Date();
  let day = nextDate.getDay();

  nextDate.setDate(nextDate.getDate());
  while (working ? closedDays.has(day) : !closedDays.has(day)) {
    day = day === 6 ? 0 : day + 1;
    nextDate.setDate(nextDate.getDate() + 1);
  }

  const month = ("0" + (nextDate.getMonth() + 1)).slice(-2);
  const date = ("0" + nextDate.getDate()).slice(-2);
  const year = nextDate.getFullYear();

  return `${month}${date}${year}`;
}

module.exports = generateNextDate;
