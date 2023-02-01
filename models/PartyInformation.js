const bookshelf = require('../database.js');

var party_information = bookshelf.Model.extend({
  tableName: 'party_informations',
  hasTimestamps: true,
});

module.exports = bookshelf.model('party_information', party_information);