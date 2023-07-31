const Router = require("express");

const usersRouter = require("./usersRoutes");
const sessionsRouter = require("./sessionsRoutes");
const transactionsRouter = require("./transactionsRoutes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/transactions", transactionsRouter);

module.exports = routes;