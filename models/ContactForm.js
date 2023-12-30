const bookshelf = require('../database.js');

var ContactForm = bookshelf.Model.extend({
  tableName: 'contactForm',
  hasTimestamps: true,
});

module.exports = bookshelf.model('ContactForm', ContactForm);