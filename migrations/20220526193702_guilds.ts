import type { Knex } from "knex";

function up(knex: Knex) {
  return knex.schema.createTable("guilds", (table) => {
    table.uuid("id").primary();
    table.json("channels");
    table.json("roles");
  });
}

function down(knex: Knex) {
  return knex.schema.dropTable("guilds");
}

module.exports = { up, down };
