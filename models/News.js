const bookshelf = require('../database.js');

var news = bookshelf.Model.extend({
  tableName: 'news',
  hasTimestamps: true,
});

module.exports = bookshelf.model('news', news);