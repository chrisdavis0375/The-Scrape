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

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("Comment")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { Comment: dbComment._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
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
