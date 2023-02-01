
exports.up = function(knex) {
    return knex.schema.createTable('news', function(table) {
        table.increments('id').primary();
        table.string('title');
        table.string('description');
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('news');
};
