import React, { useState } from "react";
import { deleteReservation, listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../dashboard/ReservationsList";

function Search() {
  const [reservations, setReservations] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [showResults, setShowResults] = useState(false);

  function changeHandler({ target: { value } }) {
    setMobileNumber(value);
  }

  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    performSearch();
  }

  function performSearch() {
    setSearchError(null);
    setShowResults(false);
    listReservations({ mobile_number: mobileNumber })
      .then(setReservations)
      .then(() => setShowResults(true))
      .catch(setSearchError);
  }

  function onCancel(reservation_id) {
    setCancelError(null);
    deleteReservation(reservation_id).then(performSearch).catch(setCancelError);
  }

  return (
    <main>
      <h1>Search reservations</h1>
      <ErrorAlert error={searchError} />
      <ErrorAlert error={cancelError} />
      <form onSubmit={submitHandler}>
        <fieldset>
          <div className="row">
            <div className="form-group col-md-4 col-sm-12">
              <label htmlFor="mobile_number">Mobile Number:</label>
              <div className="input-group">
                <input
                  type="text"
                  id="mobile_number"
                  name="mobile_number"
                  className="form-control"
                  value={mobileNumber}
                  placeholder="Enter the customer's mobile number"
                  onChange={changeHandler}
                />
                <div className="input-group-append">
                  <button type="submit" className="btn btn-primary">
                    <span className="oi oi-magnifying-glass" /> Find
                  </button>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
      {showResults && (
        <div className="table-responsive">
          <table className="table no-wrap">
            <thead>
              <tr>
                <th className="border-top-0">#</th>
                <th className="border-top-0">FIRST NAME</th>
                <th className="border-top-0">LAST NAME</th>
                <th className="border-top-0">PHONE</th>
                <th className="border-top-0">DATE</th>
                <th className="border-top-0">TIME</th>
                <th className="border-top-0">PEOPLE</th>
              </tr>
            </thead>
            <tbody>
              <ReservationsList
                onCancel={onCancel}
                reservations={reservations}
              />
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Search;
