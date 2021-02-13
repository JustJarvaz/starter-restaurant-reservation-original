import React from "react";
import { Link } from "react-router-dom";

function ReservationsList({ onCancel, reservations = [] }) {
  function cancelHandler(event) {
    const { reservationId } = event.target.dataset;
    onCancel(reservationId);
  }

  if (reservations.length) {
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
          <td>
            <Link
              className="btn btn-secondary"
              to={`/reservations/${reservation.reservation_id}/edit`}
            >
              Edit
            </Link>
          </td>
          <td>
            <button
              type="button"
              className="btn btn-secondary mr-2 cancel"
              data-reservation-id={reservation.reservation_id}
              onClick={cancelHandler}
            >
              Cancel
            </button>
          </td>
        </tr>
      );
    });
  }
  return (
    <tr>
      <td colSpan="6">No reservations found.</td>
    </tr>
  );
}

export default ReservationsList;
