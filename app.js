console.log("Our express App will go here");

var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true }));
app.set("view engine", "ejs");

//mongoose.connect("mongodb://vcm-3215.vm.duke.edu:27017/tinyurls");
mongoose.connect("mongodb://localhost/tinyurls");

var tinyURLSchema = new mongoose.Schema({
	shortURL : String,
	originalURL : String,
	// Sets default value to 0. Handles cases that the first 13 records doesn't contain "clickNum" field.
	clickNum:  {
		type: Number,
		default : 0
	}
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
	console.log("Request IP " + req.ip);
	console.log("Referer " + req.headers.referer);
	console.log("Date is " + req.get('Date'));
	res.render("homepage");
});


//post
app.post("/urls", function(req, res){
	//tranform a url
    var originalUrl = req.body.originalURL;
    var customizedUrl = req.body.customizedURL;


    // Checks whether the input for original website is valid. If yes, returns to homepage.
    if (originalUrl == "") {
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
	    // Checks whether if the customized URL blank is empty. If yes, assigned customized URL to shortened URL.
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
					    		originalURL : originalUrl,
								clickNum: 0

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
		    		originalURL : originalUrl,
                    clickNum: 0

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


// Redirects shortened URL to original URL.
app.get("/:shortURL", function(req, res){   // http://localhost:3000/000001/002      /:A/:B
	var shortUrl = req.params.shortURL;
	Url.find({"shortURL" : shortUrl}, {}, function(err, record){
		if (err) {
			console.log(err);
		}
		else {
			if (record.length == 0) {
				res.render("404page");
			}
			else {
				console.log("Find the target record");
				console.log(record);
				var originalUrl = record[0].originalURL;
				var clicknum = record[0].clickNum + 1;
				// Updates the counter by 1.
				record[0].set({clickNum : clicknum});
				// Save updated data in database.
                record[0].save(function(err, newClickNum) {
                	if (err) {
                		console.log(err);
					} else {
                		console.log("Update the click number for current URL");
                		console.log(clicknum);
                		console.log(newClickNum);
					}
				});
				console.log(originalUrl);
				res.redirect(originalUrl);
			}
		}
	});
});


// app.get("/:A/:B", function(){
// 	var a = req.params.A;
// 	var b = 
// })



// other urls without meaning
app.get("*", function(req, res){
	// res.send("404: Page Not Found");
	res.render("404page");
});

// Redirects to show top 5 clicked URLs.
app.post("/:topClick", function(req, res) {
   Url.find({'clickNum': {$gt: 0}}, {}, {sort: {clickNum: -1}, limit: 5}, function(err, record) {
        if (err) {
            console.log(err);
        } else {
           // for (var i = 0; i < record.size(); ++i) {
             //   console.log(i);
            //}
			console.log("Find " + record.length + " results.");
            res.render("topNclickedPage", {record : record});
		}
    });
});

app.listen(3000, function(){
	console.log("Serving on Port 3000");
}); 

// app.listen(8080, process.env.IP, function(){
// 	//console.log("Serving on Port " + precess.env.PORT);
// 	console.log("Serving on Port 8080");
// });
