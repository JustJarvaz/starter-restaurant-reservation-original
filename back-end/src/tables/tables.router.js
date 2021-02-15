const router = require("express").Router({ mergeParams: true });
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const reservationController = require("../reservations/reservations.controller");

router
  .route("/")
  .post(controller.create)
  .get(controller.list)
  .all(methodNotAllowed);

router
  .route("/:table_id/seat/:reservation_id")
  .all(reservationController.reservationExists)
  .post(controller.seat)
  .delete(controller.finish)
  .all(methodNotAllowed);

module.exports = router;
