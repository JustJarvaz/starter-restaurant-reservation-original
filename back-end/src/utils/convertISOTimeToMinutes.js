function convertISOTimeToMinutes(time = "0:0") {
  const result = time.split(":").map((part) => parseInt(part));
  return result[0] * 60 + result[1];
}

module.exports = convertISOTimeToMinutes;
