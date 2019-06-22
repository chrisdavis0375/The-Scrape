// DEPENDENCIES ===============================================================================
var express = require("express");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// Requiring all models
var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

//Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/articledb", { useNewUrlParser: true });

// HTML ROUTES
// ======================================================================
app.get("/", function(req, res) {
  res.render("index");
});

app.get("/saved", function(req, res) {
  res.render("saved");
});

// SCRAPE ROUTE
// ======================================================================
app.get("/scrape", function(req, res) {
  axios.get("https://www.nytimes.com/section/world").then(function(response) {
    var $ = cheerio.load(response.data);
    console.log($);
    $("figure img").each(function(i, element) {
      var result = {};
      var photo = $(element).findAll(".css-11cwn6f");
      result.title = $(this).children("figure");
      //console.log(result.title);
      console.log(photo);
    });
  });
});

app.listen(PORT, function(err) {
  if (err) {
    console.log(err);
  }
  console.log(
    "Listening on port" +
      " " +
      PORT +
      ". " +
      "Visit http://localhost:3000/ in your browser."
  );
});

module.export = app;
