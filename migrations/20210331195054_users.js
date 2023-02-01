
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.string('email');
        table.string('name');
        table.string('phone');
        table.string('photo',1500000);
        table.string('type');
        table.string('designation');
        table.integer('order');
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
