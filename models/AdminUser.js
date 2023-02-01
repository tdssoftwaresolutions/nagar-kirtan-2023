const bookshelf = require('../database.js');

var AdminUser = bookshelf.Model.extend({
  tableName: 'admin_users',
  hasTimestamps: true,
});

module.exports = bookshelf.model('AdminUser', AdminUser);