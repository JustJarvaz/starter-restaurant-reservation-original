import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import { formatAsDate } from "../utils/dates";

function ReservationCreate() {
  const history = useHistory();

  const [error, setError] = useState(null);

  function submitHandler(dish) {
    const abortController = new AbortController();
    setError(null);
    createReservation(dish, abortController.signal)
      .then((savedReservation) => {
        console.log("savedReservation", savedReservation);
        history.push(
          `/dashboard?date=${formatAsDate(savedReservation.reservation_date)}`
        );
      })
      .catch(setError);
    return () => abortController.abort();
  }

  function cancelHandler() {
    history.goBack();
  }

  return (
    <main>
      <h1>Create Reservation</h1>
      <ErrorAlert error={error} />
      <ReservationForm onSubmit={submitHandler} onCancel={cancelHandler} />
    </main>
  );
}

export default ReservationCreate;
