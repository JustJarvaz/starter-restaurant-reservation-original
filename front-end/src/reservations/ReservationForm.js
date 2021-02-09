import React, { useState, useEffect } from "react";
import validate from "./validate";
import { STATUS } from "./constants";

function ReservationForm({
  onSubmit,
  onCancel,
  initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  },
}) {
  const [reservation, setReservation] = useState(initialState);
  const [status, setStatus] = useState(STATUS.idle);
  const [errors, setErrors] = useState({});
  const isValid = Object.keys(errors).length === 0;

  useEffect(() => {
    if (isValid && status === STATUS.submitting) {
      onSubmit(reservation);
      setStatus(STATUS.submitted);
    }
  }, [errors, isValid, onSubmit, reservation, status]);

  function changeHandler({ target: { name, value } }) {
    setReservation((previousReservation) => ({
      ...previousReservation,
      [name]: value,
    }));
  }

  function numberChangeHandler({ target: { name, value } }) {
    setReservation((previousReservation) => ({
      ...previousReservation,
      [name]: Number(value),
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    setStatus(STATUS.submitting);
    setErrors(validate(reservation));
  }

  return (
    <>
      {!isValid && (
        <div className="alert alert-danger" data-test="errors">
          <p>Please fix the following errors:</p>
          <ul>
            {Object.values(errors).map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={submitHandler}>
        <fieldset>
          <div className="row">
            <div className="form-group col">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                className="form-control"
                value={reservation.first_name}
                required={true}
                placeholder="First Name"
                onChange={changeHandler}
              />
            </div>
            <div className="form-group col">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                className="form-control"
                value={reservation.last_name}
                required={true}
                placeholder="Last Name"
                onChange={changeHandler}
              />
            </div>
            <div className="form-group col">
              <label htmlFor="mobile_number">Mobile Number</label>
              <input
                type="text"
                id="mobile_number"
                name="mobile_number"
                className="form-control"
                value={reservation.mobile_number}
                required={true}
                placeholder="Mobile Number"
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col">
              <label htmlFor="reservation_date">Date</label>
              <input
                type="date"
                id="reservation_date"
                name="reservation_date"
                className="form-control"
                value={reservation.reservation_date}
                required={true}
                placeholder="Date"
                onChange={changeHandler}
              />
            </div>
            <div className="form-group col">
              <label htmlFor="date">Time</label>
              <input
                type="time"
                id="reservation_time"
                name="reservation_time"
                className="form-control"
                value={reservation.reservation_time}
                required={true}
                placeholder="Date"
                onChange={changeHandler}
              />
            </div>
            <div className="form-group col">
              <label htmlFor="people">People</label>
              <input
                type="number"
                id="people"
                name="people"
                className="form-control"
                aria-label="Number of people"
                required={true}
                value={reservation.people}
                min={1}
                onChange={numberChangeHandler}
              />
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary mr-2 cancel"
            onClick={onCancel}
          >
            <span className="oi oi-x" /> Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <span className="oi oi-check" /> Submit
          </button>
        </fieldset>
      </form>
    </>
  );
}

export default ReservationForm;
