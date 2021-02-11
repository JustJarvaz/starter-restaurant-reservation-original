import { WEEKDAYS, RESTAURANT_SCHEDULE, ERROR_MESSAGES } from "./constants";
import convertISOTimeToMinutes from "../utils/convertISOTimeToMinutes";

function isFutureDate(errors, date, time) {
  if (new Date(`${date} ${time}`) < new Date())
    errors.date = ERROR_MESSAGES.invalidDate;
  return errors;
}

function isWorkingDay(errors, date) {
  const day = new Date(date).getUTCDay();
  if (RESTAURANT_SCHEDULE.closedDays.includes(day)) {
    errors.invalidDay = `${ERROR_MESSAGES.invalidDay}: ${WEEKDAYS[day]}`;
  }
  return errors;
}

function isWithinEligibleTimeframe(errors, time) {
  let reservationTime = convertISOTimeToMinutes(time);
  if (
    reservationTime < convertISOTimeToMinutes(RESTAURANT_SCHEDULE.openTime) ||
    reservationTime >
      convertISOTimeToMinutes(RESTAURANT_SCHEDULE.closeTime) -
        RESTAURANT_SCHEDULE.closeTimeBuffer
  ) {
    errors.time = ERROR_MESSAGES.invalidTime;
  }

  return errors;
}

export default function validate({
  reservation_date: reservationDate,
  reservation_time: reservationTime,
}) {
  const errors = {};

  reservationDate = Array.isArray(reservationDate)
    ? reservationDate[0]
    : reservationDate;

  reservationTime = Array.isArray(reservationTime)
    ? reservationTime[0]
    : reservationTime;

  isFutureDate(errors, reservationDate, reservationTime);
  isWorkingDay(errors, reservationDate);
  isWithinEligibleTimeframe(errors, reservationTime);
  return errors;
}
