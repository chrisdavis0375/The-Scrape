$.getJSON("/articles", function(data) {
  if (data) {
    console.log("Articles retrieved.");
  }

  for (var i = 0; i < data.length; i++) {
    $(".row").append(
      "<div><p>" + data[i].title + "<br />" + data[i].summary + "</p></div>"
    );
  }
});
