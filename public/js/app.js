$.getJSON("/articles", function(data) {
  if (data) {
    console.log("Articles retrieved.");
  }

  for (var i = 4; i < data.length; i++) {
    $(".articles-section").append(
      "<div class = 'row'>" +
        "<div class = 'col-sm-12 article-content-boxes'>" +
        "<p>" +
        data[i].title +
        "</p>" +
        "<br />" +
        "<p>" +
        data[i].summary +
        "</p>" +
        "</div>" +
        "</div>" +
        // "<div class = 'row'>" +
        // "<div class = 'col-sm-12' id = 'comment-section'>" +
        // "<p class = 'comment-text'>Leave a comment here!" +
        // "</p>" +
        // "<textarea class = 'col-sm-8'>" +
        // "</textarea>" +
        // "</div>" +
        "</div>"
    );
  }
});
