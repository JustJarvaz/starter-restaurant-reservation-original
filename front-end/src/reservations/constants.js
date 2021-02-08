const STATUS = {
  idle: "idle",
  submitting: "submitting",
  submitted: "submitted",
  completed: "completed",
};

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const RESTAURANT_SCHEDULE = {
  closeTimeBuffer: 60,
  closeTime: "22:30",
  closedDays: [2], // 0 - Sunday, 1 - Monday, 2 - Tuesday, 3 - Wednesday, 4 - Thursday, 5 - Friday, 6 - Saturday
  openTime: "10:30",
};

const ERROR_MESSAGES = {
  invalidDate: "Reservation date/time must occur in the future",
  invalidTime: "Please select a valid time",
  invalidDay: "The restaurant is closed on the selected day",
};

export { ERROR_MESSAGES, RESTAURANT_SCHEDULE, STATUS, WEEKDAYS };