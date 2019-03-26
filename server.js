// Dependencies
var express = require("express");
var path = require("path");
var exphbs = require("express-handlebars");
var PORT = process.env.PORT || 3000;
var router = require("./routes/routes");
// Initialize Express
var app = express();

// Serve static content for the app from the "public" directory.
app.use(express.static(path.join(__dirname, "/public")));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars.

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.


app.use(router);

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App now listening at localhost:" + PORT);
});