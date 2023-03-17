const mongoose = require("mongoose");

// creates the schema
var Schema = mongoose.Schema;
var ChatMessageSchema = new Schema({
  time: Date,
  alias: String,
  message: String
});
module.exports = mongoose.model('ChatMessage', ChatMessageSchema );
