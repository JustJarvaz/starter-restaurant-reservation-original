const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasReservationId(req, res, next) {
  const reservation_id =
    req.params.reservation_id || req.body?.data?.reservation_id;

  if (reservation_id) {
    res.locals.reservation_id = reservation_id;
    next();
    req.log.trace({
      __filename,
      methodName: reservationExists.name,
      data: reservation_id,
    });
  } else {
    next({
      status: 400,
      message: `reservation_id is required`,
    });
    req.log.trace({
      __filename,
      methodName: reservationExists.name,
      data: 400,
    });
  }
}

async function reservationExists(req, res, next) {
  req.log.debug({ __filename, methodName: reservationExists.name });

  const reservation_id = res.locals.reservation_id;

  const reservation = await service.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    next();
    req.log.trace({
      __filename,
      methodName: reservationExists.name,
      data: reservation,
    });
  } else {
    next({
      status: 404,
      message: `Reservation id does not exist: ${reservation_id}`,
    });
    req.log.trace({
      __filename,
      methodName: reservationExists.name,
      reservation_id,
      data: 404,
    });
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

  const data = await (req.query.mobile_number
    ? service.search(req.query.mobile_number, req.log)
    : service.list(req.query.date, req.log));

  res.json({
    data,
  });

  req.log.trace({ __filename, methodName: list.name, return: true, data });
}

async function read(req, res) {
  req.log.debug({ __filename, methodName: read.name });

  const data = res.locals.reservation;

  res.json({
    data,
  });

  req.log.trace({ __filename, methodName: read.name, return: true, data });
}

async function destroy(req, res) {
  req.log.debug({ __filename, methodName: destroy.name });

  const { reservation_id } = res.locals.reservation;
  const data = await service.delete(reservation_id);
  res.sendStatus(204);

  req.log.trace({ __filename, methodName: destroy.name, return: true, data });
}

async function update(req, res) {
  req.log.debug({ __filename, methodName: update.name });

  const { reservation_id } = res.locals.reservation;
  req.body.data.reservation_id = reservation_id;

  const data = await service.update(req.body.data, req.log);

  res.json({ data });

  req.log.trace({ __filename, methodName: update.name, return: true, data });
}

async function status(req, res) {
  req.log.debug({
    __filename,
    methodName: status.name,
    status: req.body.data.status,
  });

  res.locals.reservation.status = req.body.data.status;

  const data = await service.status(res.locals.reservation, req.log);

  res.json({ data });

  req.log.trace({ __filename, methodName: status.name, return: true, data });
}

function statusIsNotFinished(req, res, next) {
  if ("finished" === res.locals.reservation.status) {
    next({
      status: 400,
      message: `Reservation status is 'finished', no changes can be made.`,
    });
    req.log.trace({
      __filename,
      methodName: statusIsNotFinished.name,
      data: 400,
    });
  } else {
    next();
    req.log.trace({
      __filename,
      methodName: statusIsNotFinished.name,
      data: res.locals.reservation.status,
    });
  }
}

module.exports = {
  create: asyncErrorBoundary(create),
  delete: [
    hasReservationId,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(destroy),
  ],
  list: asyncErrorBoundary(list),
  read: [
    hasReservationId,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read),
  ],
  reservationExists: [hasReservationId, asyncErrorBoundary(reservationExists)],
  status: [
    hasReservationId,
    asyncErrorBoundary(reservationExists),
    statusIsNotFinished,
    asyncErrorBoundary(status),
  ],
  update: [
    hasReservationId,
    asyncErrorBoundary(reservationExists),
    statusIsNotFinished,
    asyncErrorBoundary(update),
  ],
};
