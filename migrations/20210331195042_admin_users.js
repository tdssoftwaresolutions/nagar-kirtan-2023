
exports.up = function(knex) {
    return knex.schema.createTable('admin_users', function(table) {
        table.increments('id').primary();
        table.string('name');
        table.string('username').unique().notNullable();
        table.string('password');
        table.string('type');
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('admin_users');
};
