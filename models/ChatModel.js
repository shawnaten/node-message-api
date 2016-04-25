const Mongoose = require('mongoose');
const UUID = require('uuid');
const Schema = Mongoose.Schema;
const DBConnection = require('./DBConnection');

const ChatSchema = new Schema({
  _users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  topic: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const model = DBConnection.model('Chat', ChatSchema);

module.exports = model;
