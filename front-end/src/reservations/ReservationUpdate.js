import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import { formatAsDate } from "../utils/dates";

function ReservationUpdate() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [reservation, setReservation] = useState(null);
  const [reservationError, setReservationError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    setReservationError(null);
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationError);

    return () => abortController.abort();
  }, [reservation_id]);

  function submitHandler(reservation) {
    const abortController = new AbortController();
    setReservationError(null);
    updateReservation(
      { reservation_id, ...reservation },
      abortController.signal
    )
      .then((updatedReservation) => {
        history.push(
          `/dashboard?date=${formatAsDate(updatedReservation.reservation_date)}`
        );
      })
      .catch(setReservationError);
    return () => abortController.abort();
  }

  function cancelHandler() {
    history.goBack();
  }

  return (
    <main>
      <h1>Edit Reservation</h1>
      <ErrorAlert error={reservationError} />
      {reservation && (
        <ReservationForm
          initialState={reservation}
          onSubmit={submitHandler}
          onCancel={cancelHandler}
        />
      )}
    </main>
  );
}

export default ReservationUpdate;
