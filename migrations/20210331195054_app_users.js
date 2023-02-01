
exports.up = function(knex) {
    return knex.schema.createTable('app_users', function(table) {
        table.increments('id').primary();
        table.string('data',10000);
        table.string('fcm_user_token');
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('app_users');
};
