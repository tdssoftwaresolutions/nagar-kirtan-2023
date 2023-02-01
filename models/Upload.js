const bookshelf = require('../database.js');

var upload = bookshelf.Model.extend({
  tableName: 'uploads',
  hasTimestamps: true,
});

module.exports = bookshelf.model('upload', upload);