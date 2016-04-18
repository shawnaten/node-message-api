// Class representing user in Bank's DB.
// Outlines DB schema.

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  first: String,
  middle: String,
  last: String,
  email: String,
  role: String,
  ssn: Number
});

var conn = mongoose.createConnection('mongodb://db/bank');
conn.on('error', function (callback) {
  console.error('Failed to connect to Bank DB.');
});
conn.once('open', function (callback) {
  console.log('Connected to Bank DB.');
});

module.exports = conn.model('User', UserSchema);
