const bookshelf = require('../database.js');

var AppUser = bookshelf.Model.extend({
  tableName: 'app_users',
  hasTimestamps: true,
});

module.exports = bookshelf.model('AppUser', AppUser);