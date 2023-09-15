const Router = require("express");

const usersRouter = require("./usersRoutes.js");
const sessionsRouter = require("./sessionsRoutes.js");
const transactionsRouter = require("./transactionsRoutes.js");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/transactions", transactionsRouter);

module.exports = routes;