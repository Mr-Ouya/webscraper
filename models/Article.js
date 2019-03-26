var mongoose = require("mongoose");
var Schema = mongoose.Schema

var ArticleSchema = new Schema({
  headline: String,
 
  lead: String,
  link: String,
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;