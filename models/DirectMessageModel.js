const Mongoose = require('mongoose');
const UUID = require('uuid');
const Schema = Mongoose.Schema;
const DBConnection = require('./DBConnection');

const DirectMessageSchema = new Schema({
  _userIdTo: { type: Schema.Types.ObjectId, required: true },
  _userIdFrom: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, expires: '1d', default: Date.now },
  text: { type: String, required: true }
});

const model = DBConnection.model('DirectMessage', DirectMessageSchema);

module.exports = model;
