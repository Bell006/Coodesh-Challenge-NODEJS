const path = require("path");

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "dataBase", "database.db")
    },
    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    },
    useNullAsDefault: true, 
    migrations: {
      directory: path.resolve(__dirname, "src", "dataBase", "knex", "migrations")
    }
  }

};