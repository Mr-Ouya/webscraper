var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  noteDescription: String
});

var worthlessComments = mongoose.model("Note", NoteSchema);

module.exports = worthlessComments;