import React, { useEffect, useState } from "react";
import { listReservations, searchReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Link } from "react-router-dom";
import { next, previous, today } from "../utils/dates";
import TablesList from "./TablesList";
import ReservationsList from "./ReservationsList";
import ReservationsSearch from "./ReservationsSearch";

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [searchValue, setSearchValue] = useState("");

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations(date, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal).then(setTables).catch(setTablesError);

    return () => abortController.abort();
  }

  async function loadSearchResults() {
    const abortController = new AbortController();
    setReservationsError(null);
    searchReservations(searchValue, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal).then(setTables).catch(setTablesError);

    return () => abortController.abort();
  }

  function renderSubheading() {
    return searchValue ? (
      <h4 className="box-title mb-0">
        Showing all reservations for {searchValue}
      </h4>
    ) : (
      <h4 className="box-title mb-0">Reservations for {date}</h4>
    );
  }
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="row">
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="d-md-flex mb-3">{renderSubheading()}</div>
          <ErrorAlert error={reservationsError} />
          <ReservationsSearch
            loadSearchResults={loadSearchResults}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          {reservations.length === 0 && <p>No reservation found</p>}
          <div
            className="btn-group"
            role="group"
            aria-label="navigation buttons"
          >
            <Link
              className="btn btn-secondary"
              to={`/dashboard?date=${previous(date)}`}
            >
              <span className="oi oi-chevron-left" />
              &nbsp;Previous
            </Link>
            <Link
              className="btn btn-secondary"
              to={`/dashboard?date=${today()}`}
            >
              Today
            </Link>
            <Link
              className="btn btn-secondary"
              to={`/dashboard?date=${next(date)}`}
            >
              Next&nbsp;
              <span className="oi oi-chevron-right" />
            </Link>
          </div>
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
                  loadDashboard={loadDashboard}
                  reservations={reservations}
                  setReservationsError={setReservationsError}
                />
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6 col-lg-6 col-sm-12">
          <ErrorAlert error={tablesError} />
          <div className="table-responsive">
            <table className="table no-wrap">
              <thead>
                <tr>
                  <th className="border-top-0">#</th>
                  <th className="border-top-0">TABLE NAME</th>
                  <th className="border-top-0">CAPACITY</th>
                  <th className="border-top-0">Free?</th>
                </tr>
              </thead>
              <tbody>
                <TablesList tables={tables} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
