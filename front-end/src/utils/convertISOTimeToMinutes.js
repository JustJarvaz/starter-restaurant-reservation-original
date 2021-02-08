export default function convertISOTimeToMinutes(time) {
  let result = time.split(":").map((part) => parseInt(part));
  return result[0] * 60 + result[1];
}
