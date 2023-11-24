var env = process.env.NODE_ENV || 'development';
var config = require('./knexfile')[env];

var knex = require('knex')(config);
var bookshelf = require('bookshelf')(knex);

bookshelf.model();

module.exports = bookshelf;
