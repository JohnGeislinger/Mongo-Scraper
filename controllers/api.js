// ====================================================
// Dependencies
// ====================================================
const express = ("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

// ====================================================
// Routes
// ====================================================
// Routes for Scraping and Displaying Data
router.get("/scrape", function(req, res) {
    axios.get("https://www.nytimes.com/")
        .then(function(response) {
            let $ = cheerio.load(response.data);
            $("article").each(function(i, element) {
                let result = {};

                result.title = $(this)
                    .children(".story-heading")
                    .children("a")
                    .text().trim();
                result.link = $(this)
                    .children(".story-heading")
                    .children("a")
                    .attr("href");
                
                db.Article.create(result)
                    .then(function(dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            });

            res.redirect("/");
        });
});

router.get("/", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            const retrievedArticles = dbArticle;
            let hbsObject = {
                articles: dbArticle
            };
            res.render("index", hbsObject);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.get("/saved", (req, res) => {
    db.Article.find({ isSaved: true })
        .then(function(retrievedArticles) {
            let hbsObject = {
                articles: retrievedArticles
            };
            res.render("saved", hbsObject);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// Routes for Articles
router.get("/articles", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.get("/articles/:id", function(req, res) {
    db.Article.find({ _id: req.params.id })
        .populate({
            path: "note",
            model: "Note"
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.put("/save/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.put("/remove/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// Routes for Notes
router.post("/note/:id", function(req, res) {
    db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: db.Note._id }}, {new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.delete("/note/:id", function(req, res) {
    db.Note.findByIdAndRemove({ _id: req.params.id })
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ note: req.params.id }, { $pullAll: [{ note: req.params.id }]});
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// ====================================================
// Exports
// ====================================================
module.exports = router;