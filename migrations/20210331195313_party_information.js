
exports.up = function(knex) {
    return knex.schema.createTable('party_informations', function(table) {
        table.increments('id').primary();
        table.string('about_us',100000);
        table.string('manifesto',100000);
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
  return knex.schema.dropTable('party_informations');
};
