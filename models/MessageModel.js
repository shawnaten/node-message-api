const Mongoose = require('mongoose');
const UUID = require('uuid');
const Schema = Mongoose.Schema;
const DBConnection = require('./DBConnection');

const MessageSchema = new Schema({
  _chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  _userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  text: { type: String, required: true }
});

const model = DBConnection.model('Message', MessageSchema);

module.exports = model;
