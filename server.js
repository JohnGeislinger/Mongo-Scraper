// ====================================================
// Dependencies
// ====================================================
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// ====================================================
// Scraping Tools
// ====================================================
const axios = require('axios');
const cheerio = require('cheerio');

// ====================================================
// Require All Models
// ====================================================
const db = require('./models');

// ====================================================
// Set Up Express
// ====================================================
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ====================================================
// Connect To MongoDB
// ====================================================
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// ====================================================
// Set Up Handlebars
// ====================================================
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// ====================================================
// Routes
// ====================================================
const router = require("./controllers/api");

app.use(router);

// ====================================================
// Listening
// ====================================================
app.listen(PORT, function() {
    console.log("Server listening on PORT: " + PORT + "!");
});