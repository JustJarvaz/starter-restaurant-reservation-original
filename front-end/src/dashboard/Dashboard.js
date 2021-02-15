import React, { useEffect, useState } from "react";
import {
  deleteReservation,
  finishTable,
  listReservations,
  listTables,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/dates";
import TablesList from "./TablesList";
import ReservationsList from "./ReservationsList";
import DateButtons from "./DateButtons";

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal).then(setTables).catch(setTablesError);

    return () => abortController.abort();
  }

  function onCancel(reservation_id) {
    deleteReservation(reservation_id)
      .then(loadDashboard)
      .catch(setReservationsError);
  }

  function onFinish(table_id, reservation_id) {
    finishTable(table_id, reservation_id)
      .then(loadDashboard)
      .catch(setTablesError);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="row">
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="d-md-flex mb-3">
            <h4 className="box-title mb-0">Reservations for {date}</h4>
          </div>
          <ErrorAlert error={reservationsError} />
          <DateButtons
            previous={`/dashboard?date=${previous(date)}`}
            today={`/dashboard?date=${today()}`}
            next={`/dashboard?date=${next(date)}`}
          />
          <ReservationsList onCancel={onCancel} reservations={reservations} />
        </div>
        <div className="col-md-6 col-lg-6 col-sm-12">
          <ErrorAlert error={tablesError} />
          <TablesList onFinish={onFinish} tables={tables} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
