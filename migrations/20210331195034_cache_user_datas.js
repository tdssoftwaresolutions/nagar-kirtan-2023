
exports.up = function(knex) {
    return knex.schema.createTable('cache_user_data', function(table) {
        table.increments('id').primary();
        table.string('data',10000);
        table.string('state');
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('cache_user_data');
};
