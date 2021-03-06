var mongoose = require("mongoose");

//Constructor to reference Schema
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String
    //required: true
  },
  summary: {
    type: String
  },
  link: {
    type: String
    //required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
