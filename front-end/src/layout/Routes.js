import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import ReservationCreate from "../reservations/ReservationCreate";
import ReservationUpdate from "../reservations/ReservationUpdate";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import useQuery from "../utils/useQuery";
import { today } from "../utils/dates";
import TableCreate from "../tables/TableCreate";
import ReservationSeat from "../reservations/ReservationSeat";

function Routes() {
  const query = useQuery();

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/new">
        <ReservationCreate />
      </Route>
      <Route path="/reservations/update/:reservation_id">
        <ReservationUpdate />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeat />
      </Route>
      <Route path="/tables/new">
        <TableCreate />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={query.get("date") || today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
