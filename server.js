// DEPENDENCIES ===============================================================================
var express = require("express");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");

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

// ROUTES
// ======================================================================
app.get("/", function(req, res) {
  res.render("index");
});

app.get("/saved", function(req, res) {
  res.render("saved");
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
