const Mongoose = require('mongoose');

const conn = Mongoose.createConnection('mongodb://db/api');
conn.on('error', function (callback) {
  console.error('Failed to connect to API DB.');
});
conn.once('open', function (callback) {
  console.log('Connected to API DB.');
});

module.exports = conn;
