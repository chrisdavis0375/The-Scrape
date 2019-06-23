$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#article-boxes").append("<p data-id=" + data[i]._id + "></p>");
  }
});
