
exports.up = function(knex) {
    return knex.schema.createTable('memberships', function(table) {
        table.increments('id').primary();
        table.string('name');
        table.string('qualification');
        table.string('criminal_case');
        table.string('father_or_mother_name');
        table.string('gender');
        table.date('dob');
        table.string('state');
        table.string('district');
        table.string('vidhan_sabha_constituency');
        table.string('house_no');
        table.string('address');
        table.string('pincode_zipcode');
        table.string('voter_id_number');
        table.boolean('would_you_want_to_volunteer');
        table.string('type_of_membership');
        table.string('email');
        table.string('phone');
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('memberships');
};
