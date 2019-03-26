// Dependencies
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var db = require("../models");

// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Connect to the Mongo DB
var databaseUrl = "thecrapper";
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/" + databaseUrl;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

// function for executing the scraping process
function scrapeMeDaddy(existingArticles, res) {
  // Make a request via axios for the news section of `tsn.ca`
  axios.get("https://www.cbc.ca/news").then(function(response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);
    var newArticles = [];
    var newHeadline = true;

    $(".primaryTopStories > .contentList > .contentListCards a").each(function(i, element) {
      var headline = $(element).children("div.contentWrapper").children("div.card-content").children("div.card-content-top").children("h3.headline").text();
      var lead = $(element).children("div.contentWrapper").children("div.card-content").children("div.card-content-top").children("div.description").text();
    var link = "www.google.com";
    console.log("Headline: ", headline, "Article: ", lead)
      
      

    for (var i = 0; i < existingArticles.length; i++) {
        if (existingArticles[i].headline === headline) {
          newHeadline = false;
        }
      }

      if (newHeadline && headline && lead) {
        newArticles.push({
          headline: headline,
          lead: lead,
          link: link
        });
      }
    });


    // insert the array of newArticles into the database
    db.Article.insertMany(newArticles, function(err) {
      if (err) throw err;
      res.end();
    });
  });
}

router.get("/notes/:articleId", function(req, res) {
  var articleId = req.params.articleId;
  db.Article.findById(req.params.articleId)
    .populate("notes")
    .exec(function(err, found) {
      var hbsObject = {
        articleId: articleId,
        headline: found.headline,
        notes: found.notes
      };
      res.render("notes", hbsObject);
    });
});

router.post("/notes/:articleId", function(req, res) {
  db.worthlessComments.create(req.body).then(function(data) {
    db.Article.findByIdAndUpdate(
      req.params.articleId,
      { $push: { notes: data } },
      { new: true },
      function(err, found) {
        res.send("post finished");
      }
    );
  });
});

router.get("/", function(req, res) {
  // retrieve all articles already in the database
  db.Article.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, render the data with index.handlebars
    else {
      var hbsObject = {
        articles: found
      };
      res.render("index", hbsObject);
    }
  });
});

router.delete("/api/article/delete/:articleId", function(req, res) {
  db.Article.findById(req.params.articleId, function(err, found) {
    if (err) throw err;
    for (let i = 0; i < found.notes.length; i++) {
      db.Note.findByIdAndDelete(found.notes[i], function(err) {
        console.log(err);
      });
    }
  }).then(function() {
    db.Article.findByIdAndDelete(req.params.articleId, function(err) {
      console.log("error", err);
      res.send("article and subnotes deleted");
    });
  });
});

router.delete("/api/note/delete/:noteId/:articleId", function(req, res) {
  db.Article.findByIdAndUpdate(
    req.params.articleId,
    { $pullAll: { notes: [new mongoose.Types.ObjectId(req.params.noteId)] } },
    function(err) {
      db.Note.findByIdAndDelete(req.params.noteId, function(err) {
        console.log(err);
      });
      console.log("error:", err);
      res.send("done delete");
    }
  );
});

// Retrieve data from the db
router.get("/api/all", function(req, res) {
  // Find all results from the Article collection in the db
  db.Article.find({}, function(err, found) {
   
    if (err) {
      console.log(err);
    }
    
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
router.post("/api/scrape", function(req, res) {
 
  db.Article.find({}, function(err, found) {
    
    if (err) {
      console.log(err);
    }
    
    else {

      scrapeMeDaddy(found, res); 
    }
  });
});

module.exports = router;