const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const DBConnection = require('./DBConnection');

const schema = new Schema({
  _userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  key: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true }
});

const model = DBConnection.model('Key', schema);

module.exports = model;
