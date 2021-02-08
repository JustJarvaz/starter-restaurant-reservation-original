const timeFormat = /\d\d:\d\d/;
function formatReservationTime(reservations = []) {
  return reservations.map((reservation) => {
    reservation.reservation_time = reservation.reservation_time.match(
      timeFormat
    );
    return reservation;
  });
}

module.exports = formatReservationTime;
