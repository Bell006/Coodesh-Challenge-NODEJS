const config = require("../../../knexfile");
const knex = require("knex");

let db = null;
if (process.env.NODE_ENV === "test") {
  db = knex(config.test);
} else {
  db = knex(config.development);
};

module.exports = db;