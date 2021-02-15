const service = require("./events.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  req.log.debug({ __filename, methodName: list.name });

  const data = await service.list(req.query.date, req.log);

  res.json({
    data,
  });

  req.log.trace({ __filename, methodName: list.name, return: true, data });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
