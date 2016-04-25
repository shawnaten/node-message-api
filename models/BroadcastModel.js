const Mongoose = require('mongoose');
const UUID = require('uuid');
const Schema = Mongoose.Schema;
const DBConnection = require('./DBConnection');

const BroadcastSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  expireAt: { type: Date, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true }
});

BroadcastSchema.index({ expireAt: 1 }, { expireAfterSeconds : 0 });

const model = DBConnection.model('Broadcast', BroadcastSchema);

module.exports = model;
