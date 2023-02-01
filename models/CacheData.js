const bookshelf = require('../database.js');

var CacheData = bookshelf.Model.extend({
  tableName: 'cache_user_data',
  hasTimestamps: true,
});

module.exports = bookshelf.model('CacheData', CacheData);