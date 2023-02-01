
exports.up = function(knex) {
    return knex.schema.createTable('uploads', function(table) {
        table.increments('id').primary();
        table.string('name');
        table.string('description');
        table.string('file',1500000);
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
  return knex.schema.dropTable('uploads');
};
