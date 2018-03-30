console.log("Our express App will go here");

var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/tinyurls");

var tinyURLSchema = new mongoose.Schema({
	shortURL : String,
	originalURL : String
});

var Url = mongoose.model("Url", tinyURLSchema);

// var google = new Url({
// 	shortURL : "000001",
// 	originalURL : "https://www.google.com"
// });

// google.save(function(err, url){
// 	if (err) {
// 		console.log("Something went wrong!");
// 	}
// 	else {
// 		console.log("We just save a url to DB");
// 		console.log(url);
// 	}
// });

//get the counter when server started (asynchronous!!!!!)
var dbcounter = 0;

Url.count({}, function(err, count){
	if (err) {
		console.log(err);
		// stop the server
		app.stop();
	}
	else {
		dbcounter = count + 1;
		console.log(dbcounter);
	}
});

Url.find({}, function(err, records){
	if (err) {
		console.log(err);
	}
	else {
		console.log(records);
	}
});



// "/" => "homepage"
app.get("/", function(req, res){
	res.render("homepage");
});


//post
app.post("/urls", function(req, res){
	//tranform a url
    var originalUrl = req.body.originalURL;

    if (originalUrl == "") {
    	res.render("homepage");
    }
    else {
    	//todo : transform function
	    var shortUrl = dbcounter.toString();
	    while(shortUrl.length < 6) {
	    	shortUrl = "0" + shortUrl;
	    }
	    //var newTinyURL = new Url 
	    Url.create(
	    	{
	    		shortURL : shortUrl,
	    		originalURL : originalUrl

			}, function(err, newTinyURL){
				if (err) {
					console.log(err);
				}
				else {
					console.log("Create and save a new TinyURL");
					console.log(newTinyURL);
					dbcounter += 1;
				}
			});

	    res.send("URL you want to tranform is " + originalUrl + "Shortened URL is " + shortUrl);
    } 
    //res.render("homepage");
});


//redirection logic
app.get("/:shortURL", function(req, res){
	var shortUrl = req.params.shortURL;
	Url.find({shortURL : shortUrl}, 'originalURL', function(err, record){
		if (err) {
			console.log(err);

		}
		else {
			console.log("Find the target record");
			console.log(record);
			if (record.length == 0) {
				res.send("404: Page Not Found");
			}
			else {
				var originalUrl = record[0].originalURL;
				console.log(originalUrl);
				res.redirect(originalUrl);
			}
		}
	});
});



// other urls without meaning
app.get("*", function(req, res){
	// res.send("404: Page Not Found");
	res.render("404page");
});


app.listen(3000, function(){
	console.log("Serving on Port 3000");
}); 