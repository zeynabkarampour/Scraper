// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
//var axios = require("axios");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

var PORT = process.env.PORT || 8080;

// If deployed, use the deployed database. Otherwise use the local mongoScraper database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/week18Populater";


// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes
// Import routes and give the server access to them.
var routes = require("./controllers/scraper_controller.js");

app.use("/", routes);

//mongoose.connect("mongodb://heroku_gnzk5747:4d2121nhgnfbdl1pfirsdepk9n@ds125262.mlab.com:25262/heroku_gnzk5747");

// // If deployed, use the deployed database. Otherwise use the local mongoScraper database
//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";

// Database configuration with mongoose
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });



var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
    console.log("Mongoose connection successful.");
});


// Listen on port 8080
app.listen(PORT, function () {
    console.log("App running on PORT " + PORT);
});
