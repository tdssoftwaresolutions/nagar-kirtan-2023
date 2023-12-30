const bookshelf = require('../database.js');

var Newsletter = bookshelf.Model.extend({
  tableName: 'newsletter',
  hasTimestamps: true,
});

module.exports = bookshelf.model('Newsletter', Newsletter);