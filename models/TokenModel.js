// Class for a user in our messaging service.
// Outlines DB schema and handles common functions for APIUser objects.

const Mongoose = require('mongoose');
const UUID = require('uuid');
const Schema = Mongoose.Schema;
const DBConnection = require('./DBConnection');

const TokenSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, expires: '10m', default: Date.now }
});

const model = DBConnection.model('Token', TokenSchema);

module.exports = model;
