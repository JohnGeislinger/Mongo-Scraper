// ====================================================
// Dependencies
// ====================================================
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

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

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

// ====================================================
// Set Up Handlebars
// ====================================================
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// ====================================================
// Routes
// ====================================================

// ====================================================
// Listening
// ====================================================
app.listen(PORT, function() {
    console.log("Server listening on PORT: " + PORT + "!");
});