import { Link } from "react-router-dom";
import React from "react";

function ReservationButtons({ status, reservation_id, onCancel }) {
  if (status === "booked") {
    return (
      <>
        <td>
          <a
            className="btn btn-secondary"
            href={`/reservations/${reservation_id}/seat`}
          >
            Seat
          </a>
        </td>
        <td>
          <Link
            className="btn btn-secondary"
            to={`/reservations/${reservation_id}/edit`}
          >
            Edit
          </Link>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-secondary mr-2 cancel"
            data-reservation-id={reservation_id}
            onClick={onCancel}
          >
            Cancel
          </button>
        </td>
      </>
    );
  }
  return null;
}

export default ReservationButtons;
