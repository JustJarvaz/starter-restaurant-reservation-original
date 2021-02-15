const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function tableExists(req, res, next) {
  req.log.debug({ __filename, methodName: tableExists.name });

  const { table_id } = req.params;

  const table = await service.read(Number(table_id));

  if (table) {
    res.locals.table = table;
    next();
    req.log.trace({ __filename, methodName: tableExists.name, data: table });
  } else {
    next({ status: 404, message: `Table id does not exist: ${table_id}` });
    req.log.trace({
      __filename,
      methodName: tableExists.name,
      table_id,
      data: 404,
    });
  }
}

function tableIsAvailable(req, res, next) {
  req.log.debug({ __filename, methodName: tableIsAvailable.name });

  if (res.locals.table.reservation_id) {
    next({
      status: 400,
      message: `Table id is occupied: ${res.locals.table.table_id}`,
    });
    req.log.trace({ __filename, methodName: tableIsAvailable.name, data: 400 });
  } else {
    next();
    req.log.trace({
      __filename,
      methodName: tableIsAvailable.name,
      data: "next()",
    });
  }
}

function reservationStatusIsBooked(req, res, next) {
  req.log.debug({ __filename, methodName: reservationStatusIsBooked.name });

  if (res.locals.reservation.status === "booked") {
    next();
    req.log.trace({
      __filename,
      methodName: reservationStatusIsBooked.name,
      data: "next()",
    });
  } else {
    next({
      status: 400,
      message: `Reservation status must be 'booked'. It is ${res.locals.reservation.status}.`,
    });
    req.log.trace({
      __filename,
      methodName: reservationStatusIsBooked.name,
      data: 400,
    });
  }
}

function hasCapacityForReservation(req, res, next) {
  req.log.debug({ __filename, methodName: hasCapacityForReservation.name });
  if (res.locals.table.capacity < res.locals.reservation.people) {
    next({
      status: 400,
      message: `Table does not have enough capacity. Seating for ${res.locals.reservation.people} is needed.`,
    });
    req.log.trace({
      __filename,
      methodName: hasCapacityForReservation.name,
      data: 400,
    });
  } else {
    next();
    req.log.trace({ __filename, methodName: create.name, data: "next()" });
  }
}

async function create(req, res) {
  req.log.debug({ __filename, methodName: create.name });

  const data = await service.create(req.body.data, req.log);

  res.status(201).json({
    data: data,
  });

  req.log.trace({ __filename, methodName: create.name, return: true, data });
}

async function list(req, res) {
  req.log.debug({ __filename, methodName: list.name });

  const data = await service.list(req.query.date, req.log);

  res.json({
    data,
  });

  req.log.trace({ __filename, methodName: list.name, return: true, data });
}

async function seat(req, res) {
  req.log.debug({ __filename, methodName: seat.name });

  const data = await service.seat(
    res.locals.table.table_id,
    res.locals.reservation.reservation_id,
    req.log
  );

  res.json({
    data,
  });

  req.log.trace({
    __filename,
    methodName: seat.name,
    return: true,
    data,
  });
}

function tableIsOccupied(req, res, next) {
  req.log.debug({ __filename, methodName: tableIsAvailable.name });

  if (res.locals.table.reservation_id) {
    next();
    req.log.trace({
      __filename,
      methodName: tableIsAvailable.name,
      data: "next()",
    });
  } else {
    next({
      status: 400,
      message: `Table is not occupied: ${res.locals.table.table_id}`,
    });
    req.log.trace({ __filename, methodName: tableIsAvailable.name, data: 400 });
  }
}

async function finish(req, res) {
  req.log.debug({ __filename, methodName: finish.name });

  const data = await service.finish(res.locals.table);

  res.json({
    data,
  });

  req.log.trace({
    __filename,
    methodName: finish.name,
    return: true,
    data,
  });
}

module.exports = {
  create: asyncErrorBoundary(create),
  list: asyncErrorBoundary(list),
  seat: [
    asyncErrorBoundary(tableExists),
    tableIsAvailable,
    hasCapacityForReservation,
    reservationStatusIsBooked,
    asyncErrorBoundary(seat),
  ],
  finish: [
    asyncErrorBoundary(tableExists),
    tableIsOccupied,
    asyncErrorBoundary(finish),
  ],
};
