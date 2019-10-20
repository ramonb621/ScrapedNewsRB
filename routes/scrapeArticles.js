var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");


module.exports = function(app){
  // A GET route for scraping the echoJS website
  app.get("/scrape", function(req, res) {
      // First, we grab the body of the html with axios
      axios.get("https://www.npr.org/sections/news/archive").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        $(".archivelist article").each(function(i, element) {

          var result = {};

          // console.info();
    
          result.title = $(element).find("h2.title").text();
          result.link = $(element).find("h2.title").children().attr("href");
          result.summary =  $(element).find("p.teaser").text();      
          
    
          // Create a new Article using the `result` object built from scraping
          db.Article.create(result)
            .then(function(dbArticle) {
          // View the added result in the console
              console.log(dbArticle);
            })
            .catch(function(err) {

              console.error(err);
            });
            console.log(result);
        });
    
        // res.send("Scrape Is Complete!");
        res.redirect("/");
      });
    });
    
    // Route for getting all Articles from the db
    app.get("/articles", function(req, res) {
    
      db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
    });
    
    
    app.get("/articles/:id", function(req, res) {
    
      db.Article.findOne({
        _id: req.params.id
      })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
    });
}  