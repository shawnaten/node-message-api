const Mongoose = require('mongoose');
const UUID = require('uuid');
const Schema = Mongoose.Schema;
const DBConnection = require('./DBConnection');

const DirectMessageSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, expires: '10m', default: Date.now },
  text: { type: String, required: true }
});

const model = DBConnection.model('DirectMessage', DirectMessageSchema);

module.exports = model;
