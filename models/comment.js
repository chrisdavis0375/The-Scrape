var mongoose = require("mongoose");

var Schema = mongoose;
var commentSchema = new Schema({
  title: String,

  body: String
});

var comment = mongoose.model("comment", commentSchema);

module.exports = comment;
