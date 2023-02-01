const bookshelf = require('../database.js');

var complaint = bookshelf.Model.extend({
  tableName: 'complaints',
  hasTimestamps: true,
});

module.exports = bookshelf.model('complaint', complaint);