const { Router } = require("express");
const TransactionsController = require("../Controllers/transactionsController.js");
const ensureAuthentication = require("../Middlewares/ensureAuthentication.js");

const transactionsRoutes = Router();

const transactionsController = new TransactionsController();

transactionsRoutes.post("/", ensureAuthentication, transactionsController.create);
transactionsRoutes.get("/", ensureAuthentication, transactionsController.index);

module.exports = transactionsRoutes;