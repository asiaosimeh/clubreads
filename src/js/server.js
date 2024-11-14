
// Import/Require modules:
const http = require('http');
const fs = require('fs');
const url = require('url');
//call back function

// Define the (temporarily here) databank that the client can request from:
const data = [
	{"name" : "Harry Potter Reading Group", "topic" : "Fantasy", "author" : "J. K. Rowling", "loc" : "North East"},
	{"name" : "SciFi Readers", "topic" : "Science Fiction", "author" : "", "loc" : "South East"},
	{"name" : "Donna's Amazing Book Club", "topic" : "Adventure", "author" : "", "loc" : "South West"},
	{"name" : "Adventure Wranglers", "topic" : "Adventure", "author" : "", "loc" : "North East"},
	{"name" : "Matchmakers", "topic" : "Romance", "author" : "", "loc" : "North West"},
	{"name" : "Spooky Books Inc.", "topic" : "Horror", "author" : "", "loc" : "South West"},
	{"name" : "Autobiographicals Book Club", "topic" : "Non-fiction", "author" : "", "loc" : "North East"}

]
console.log(data);
// Define empty, to be used in 'fileType' function:
let cType = "";

function fileType(fileName){
	switch(fileName){
		case ".html":
			cType = "text/html";
			break;
		case ".js":
			cType = "text/javascript";
			break;
	}
	return cType;
}

// A function to translate from shorthand to full notation of book club GENRE (makes search easier):
function parseGenreCode(genreCode){
	let value = "";
	
	switch (genreCode) {
		case "ft":
			value = "Fantasy";
			break;
		case "nf":
			value = "Non-fiction";
			break;
		case "hr":
			value = "Horror";
			break;
		case "rm":
			value = "Romance";
			break;
		case "sf":
			value = "Science Fiction";
			break;
		case "ad":
			value = "Adventure";
			break;
		case "empty":
			value = "";
			break;
	} // End switch/case

	return value;
} // End function

// A function to translate from shorthand to full notation of book club LOCATION (makes search easier):
function parseLocCode(locCode){
	let value = "";
	
	switch (locCode) {
		case "NE":
			value = "North East";
			break;
		case "SE":
			value = "South East";
			break;
		case "NW":
			value = "North West";
			break;
		case "SW":
			value = "South West";
			break;
		case "empty":
			value = "";
			break;
	} // End switch/case

	return value;
} // End function

function parseSearch(res, search){
	// Create new array to hold the results to be sent to the client:
	let response = [];
	
	// Firugre out how may constraints are used:
	let topicGiven = search.topic=="empty" ? false : true; // Record whether or not a topic was given
	let authorGiven = !(search.author == ""); // Record whether or not an author was given
	let locGiven = search.loc=="empty" ? false : true; // Record whether or not a location was given
	
	console.log(topicGiven, authorGiven, locGiven, "'", search.loc, "'");
	
	// Run checks against every book club entry:
	for (e of data){
		// Check for matches, taking into account all available constraints the user has set.
		console.log("TYPE OF 'E': " + typeof(e));
		// All constraints used:
		if (topicGiven && authorGiven && locGiven && e.topic == parseGenreCode(search.topic) && e.author == search.author && e.loc == parseLocCode(search.loc)){
			console.log("MATCH FOUND -- ALL");
			response.push(JSON.stringify(e));
		} else if (!topicGiven && authorGiven && locGiven && e.author == search.author && e.loc == parseLocCode(search.loc)){
			// All but TOPIC
			console.log("MATCH FOUND -- author&loc");
			response.push(JSON.stringify(e));
		} else if (topicGiven && !authorGiven && locGiven && e.topic == parseGenreCode(search.topic) && e.loc == parseLocCode(search.loc)){
			// All but AUTHOR
			console.log("MATCH FOUND -- topic&loc");
			response.push(JSON.stringify(e));
		} else if (topicGiven && authorGiven && !locGiven && e.topic == parseGenreCode(search.topic) && e.author == search.author){
			// All but LOCATION
			console.log("MATCH FOUND -- topic&author");
			response.push(JSON.stringify(e));
		} else if (topicGiven && !authorGiven && !locGiven && e.topic == parseGenreCode(search.topic)){
			// ONLY TOPIC
			console.log("MATCH FOUND -- ONLY topic");
			response.push(JSON.stringify(e));
		} else if (!topicGiven && authorGiven && !locGiven && e.author == search.author){
			// ONLY AUTHOR
			console.log("MATCH FOUND -- ONLY author");
			response.push(JSON.stringify(e));
		} else if (!topicGiven && !authorGiven && locGiven && e.loc == parseLocCode(search.loc)){
			// ONLY LOCATION
			console.log("MATCH FOUND -- ONLY location");
			response.push(JSON.stringify(e));
		} else if (!topicGiven && !authorGiven && !locGiven) { 
			// NO CONSTRAINTS PASSED
			console.log("NO CONSTRAINTS");
			// Append all book club listings to the response array:
			for (element of data) {
				response.push(JSON.stringify(element)); 
			}
			break; // If the user entered no constraints, then no need to keep checking anything else
		}
			
	} // End loop

	console.log("RESPONSE ", response, typeof(response));
	
	// If 'response' is empty, meaning no matches were found, return a JSON object informing the cilent that no matches were found (I picked sending an object with value of "NULL"):
	if (response.length == 0){
		response.push('{"name" : "NULL"}'); // Place the special 'flag' value for 'no match' into the response array (bc the client is expecting to get an array)

		res.writeHead(200, {'Content-Type' : 'application/json'});
		res.write(JSON.stringify(response));
		res.end();
	} else{ // Otherwise, if at least one search match was found, return all matches found:
		console.log("LENGTH " + response.length);
		res.writeHead(200, {'Content-Type' : 'application/json'});
		res.write(JSON.stringify(response));
		res.end();
		
		console.log(JSON.stringify(response));
		console.log(typeof( JSON.stringify(response) ));
	}
}


serveStatic = function (req, res) {
	q = url.parse(req.url, true);
	
	let fileName = q.pathname;
	fileName = fileName == "/" ? "./pages/index.html" : fileName;
	console.log("FILENAME ", fileName);

	switch (fileName){
		case "/search":
			parseSearch(res, q.query);
		case "/favicon.ico":
				break;
		default:
			fileName = '.' + fileName;
			fs.readFile(fileName, function(err, content){
        		        console.log(err);
				if (err) {
					console.log(err);
				}
				res.writeHead(200, {'Content-Type': fileType(fileName) });
				res.write(content);
				res.end();
			});
	} // End switch/case
}
 
const myserver = http.createServer(serveStatic); //create a server object
myserver.listen(80, function() {console.log("Listening on port 80" )}); 

