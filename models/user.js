const bookshelf = require('../database.js');

var User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
});

module.exports = bookshelf.model('User', User);