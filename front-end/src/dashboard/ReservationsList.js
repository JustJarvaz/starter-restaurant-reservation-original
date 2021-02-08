import React from "react";

function ReservationsList({ reservations = [] }) {
  return reservations.map((reservation) => {
    return (
      <tr key={reservation.reservation_id}>
        <td>{reservation.reservation_id}</td>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_date}</td>
        <td>{reservation.reservation_time}</td>
        <td>{reservation.people}</td>
        <td>
          <a
            className="btn btn-secondary"
            href={`/reservations/${reservation.reservation_id}/seat`}
          >
            Seat
          </a>
        </td>
      </tr>
    );
  });
}

export default ReservationsList;
