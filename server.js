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

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articlesdb";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

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
  db.Article.find()
    .remove()
    .exec();
  axios
    .get("https://www.washingtonpost.com/world/?utm_term=.11cd4448bc7d")
    .then(function(response) {
      var $ = cheerio.load(response.data);
      //console.log($);

      $(".story-body").each(function(i, element) {
        let result = {};

        // result.image = $(this)
        //   .children("img")
        //   .attr("src")
        result.title = $(this)
          .children(".story-headline")
          .children("h2")
          .text();
        result.summary = $(this)
          .children(".story-description")
          .children("p")
          .text();
        console.log(result);

        //Creates a new Article in MongoDB using Article modal

        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
      res.send("Scrape Complete");
    });
});

app.get("/articles", function(req, res) {
  db.Article.find()
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
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
