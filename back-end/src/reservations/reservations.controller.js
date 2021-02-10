const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reservationExists(req, res, next) {
  req.log.debug({ __filename, methodName: reservationExists.name });

  const { reservation_id } = req.params;

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

  const data = await service.list(req.query.date, req.log);

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

async function search(req, res) {
  req.log.debug({ __filename, methodName: list.name });

  const data = await service.search(req.query.phone, req.log);

  res.json({
    data,
  });

  req.log.trace({ __filename, methodName: list.name, return: true, data });
}

async function destroy(req, res) {
  req.log.debug({ __filename, methodName: list.name });

  const { reservation_id } = res.locals.reservation;
  const data = await service.delete(reservation_id);
  res.sendStatus(204);

  req.log.trace({ __filename, methodName: list.name, return: true, data });
}

async function update(req, res) {
  req.log.debug({ __filename, methodName: list.name });

  const { reservation_id } = res.locals.reservation;

  const data = await service.update(req.body.data, req.log);

  res.json({ data });

  req.log.trace({ __filename, methodName: list.name, return: true, data });
}

module.exports = {
  create: asyncErrorBoundary(create),
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  reservationExists: asyncErrorBoundary(reservationExists),
  search: asyncErrorBoundary(search),
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
  update: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(update)],
};
