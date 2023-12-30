const bookshelf = require('../database.js');

var Donation = bookshelf.Model.extend({
  tableName: 'donation',
  hasTimestamps: true,
});

module.exports = bookshelf.model('Donation', Donation);