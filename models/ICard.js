const bookshelf = require('../database.js');

var icard = bookshelf.Model.extend({
  tableName: 'icards',
  hasTimestamps: true,
});

module.exports = bookshelf.model('icard', icard);