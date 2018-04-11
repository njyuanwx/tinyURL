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
    var customizedUrl = req.body.customizedURL;



    if (originalUrl == "") {  //make sure valid input for original website
    	res.render("homepage");
    }
    else {
    	// Checks whether input url contains "https" or "http". If not, adds "https://" before the url.
    	if (originalUrl.substring(0, 8) != "https://" && originalUrl.substring(0, 7) != "http://") {
    		originalUrl = "https://" + originalUrl;
		}
    	//todo : transform function
    	var shortUrl = dbcounter.toString();
    	while(shortUrl.length < 6) {
	    	shortUrl = "0" + shortUrl;
	    }
	    //check if cusURL is empty
    	if (customizedUrl != "") { 
    		shortUrl = customizedUrl;
    		Url.find({shortURL : customizedUrl}, function(err, record){
    			console.log("exist cusURL is " + record);
    			if (err) {
    				console.log(err);
    			}
    			else {
    				if (record.length == 0) { // Customized URL not used before			
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
								}
							});

					    //res.send("URL you want to tranform is " + originalUrl + " and Shortened URL is " + shortUrl);
					    res.render("resultPage", {shortUrl : shortUrl, originalUrl : originalUrl});
					    
    				}
    				else {
    					res.send("Customized URL you provided has been used before");
    					//res.end();
    				}
    			}
    		});
    	}
    	else {
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

		    //res.send("URL you want to tranform is " + originalUrl + " and Shortened URL is " + shortUrl);
		    res.render("resultPage", {shortUrl : shortUrl, originalUrl : originalUrl});
    	}	     
    } 
});


//redirection logic
app.get("/:shortURL", function(req, res){
	var shortUrl = req.params.shortURL;
	Url.find({shortURL : shortUrl}, 'originalURL', function(err, record){
		if (err) {
			console.log(err);

		}
		else {
			if (record.length == 0) {
				res.render("404Page");
			}
			else {
				console.log("Find the target record");
				console.log(record);
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