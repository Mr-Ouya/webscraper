var express  = require("express");
var  ehbs = require('express-handlebars');
var mongojs = require("mongojs");
var cheerio = require("cheerio");
var axios = require("axios");
var app = express();


app.use(express.static("public"));

var databaseUrl = "articles";
var collections = ["componets"];

app.set("view engine","ehbs");

var db = mongojs(databaseUrl,collections);


db.on("error", function (error){

    console.log("Database Error:", error);
});


app.listen(3000,function(){
    console.log("App runnning on port 3000");
})

app.get("/", function(req, res) {
  res.send("Your clothes, give them to me")
})

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.cbcScrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
    // Make a request via axios for the news section of `ycombinator`
    axios.get("https://www.cbc.ca/news").then(function(response) {
      // Load the html body from axios into cheerio
	  var $ = cheerio.load(response.data);
	  
      $(".primaryTopStories > .contentList > .contentListCards a").each(function(i, element) {
        
      //console.log($(element))

        var title = $(element).children("div.contentWrapper").children("div.card-content").children("div.card-content-top").children("h3.headline").text();
        var summary = $(element).children("div.contentWrapper").children("div.card-content").children("div.card-content-top").children("div.description").text();
       //console.log(title)
        if (title && summary) {
          // Insert the data in the scrapedData db
          db.cbcScrapedData.insert({
            title: title,
            summary: summary
          },
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              //console.log(err);
            }
            else {
              // Otherwise,  the inserted data
              //console.log(inserted);
            }
          });
        }
        
      });
      res.send("Scrape Complete, return to base!")

    });
})