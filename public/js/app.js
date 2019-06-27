$.getJSON("/articles", function(data) {
  if (data) {
    console.log("Articles retrieved.");
  }

  for (var i = 0; i < data.length; i++) {
    $(".articles-section").append(
      "<div class = 'row'>" +
        "<div class = 'col-sm-12 article-content-boxes'>" +
        "<h3 data-id=" +
        data[i]._id +
        ">" +
        data[i].title +
        "</h3>" +
        "<br />" +
        "<p>" +
        data[i].summary +
        "</p>" +
        "<button>" +
        "Save this article?" +
        "</button>" +
        "</div>" +
        "</div>" +
        "<div class = 'row'>" +
        "<div class = 'col-sm-12' id = 'comment-section'>" +
        +"</div>"
    );
  }
});

$(document).on("click", "h3", function() {
  $("#notes").empty();
  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(data) {
    console.log(data);
    // An input to enter a new title
    $("#comment-section").append("<input id='titleinput' name='title' >");
    // A textarea to add a new note body
    $("#comment-section").append(
      "<textarea id='bodyinput' name='body'></textarea>"
    );
    // A button to submit a new note, with the id of the article saved to it
    $("#comment-section").append(
      "<button data-id='" + data._id + "' id='save-comment'>Save Note</button>"
    );

    // If there's a note in the article
    if (data.Comment) {
      // Place the title of the note in the title input
      $("#titleinput").val(data.Comment.title);
      // Place the body of the note in the body textarea
      $("#bodyinput").val(data.Comment.body);
    }
  });

  // $("#bodyinput").val("");
});

$(document).on("click", "#save-comment", function() {
  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then(function(data) {
    console.log(data);
    $("#comment-section").empty();
  });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
