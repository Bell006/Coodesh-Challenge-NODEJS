const { Router } = require("express");
const TransactionsController = require("../controllers/transactionsController");
const ensureAuthentication = require("../Middlewares/ensureAuthentication")

const transactionsRoutes = Router();

const transactionsController = new TransactionsController();

transactionsRoutes.post("/", ensureAuthentication, transactionsController.create);
transactionsRoutes.get("/", ensureAuthentication, transactionsController.index);

module.exports = transactionsRoutes;