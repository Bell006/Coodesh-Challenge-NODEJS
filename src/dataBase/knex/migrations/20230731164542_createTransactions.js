//Setting migration
exports.up = knex => knex.schema.createTable("transactions", table => {
    table.increments("id");
    table.integer("type");
    table.timestamp("date");
    table.text("product");
    table.integer("value");
    table.text("client");

    //user's foreign key
    table.integer("user_id").references("id").inTable("users");
});
  

exports.down = knex => knex.schema.dropTable("transactions");