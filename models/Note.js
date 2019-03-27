var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({

  noteDescription: String
});

var Comment = mongoose.model("Note", CommentSchema);

module.exports = Comment;