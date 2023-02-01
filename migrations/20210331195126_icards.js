
exports.up = function(knex) {
    return knex.schema.createTable('icards', function(table) {
        table.increments('id').primary();
        table.string('name');
        table.string('father_name');
        table.string('designation');
        table.string('adhar_card_number');
        table.date('dob');
        table.string('blood_group');
        table.string('address',10000);
        table.string('photo',1500000);
        table.string('id_card_language');
        table.boolean('is_approved');
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('icards');
};
