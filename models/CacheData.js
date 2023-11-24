const bookshelf = require('../database.js');

var CacheData = bookshelf.Model.extend({
  tableName: 'location_data',
  hasTimestamps: true,
});

module.exports = bookshelf.model('CacheData', CacheData);