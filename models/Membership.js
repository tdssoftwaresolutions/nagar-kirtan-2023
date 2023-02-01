const bookshelf = require('../database.js');

var membership = bookshelf.Model.extend({
  tableName: 'memberships',
  hasTimestamps: true,
});

module.exports = bookshelf.model('membership', membership);