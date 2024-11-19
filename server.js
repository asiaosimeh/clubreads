
// Import/Require modules:
const http = require('http');
const fs = require('fs');
const url = require('url');
const mysql = require('mysql2');

const connectionObj = {
	host	 : '35.237.115.8',
	user	 : 'asiaosimeh',
	password : 'clubreads2024',
	database : 'BookClubDB',
	connectionLimit : 10
}

const connectionObj_IT = {
	host	 : '35.237.115.8',
	user	 : 'asiaosimeh',
	password : 'clubreads2024',
	database : 'RegisterDB',
	connectionLimit: 10
}

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
	
	let response = rtrvDB(search.topic, search.author, search.loc);
	
	// If 'response' is empty, meaning no matches were found, return a JSON object informing the cilent that no matches were found (I picked sending an object with value of "NULL"):
	if (response.length == 0){
		let out = ('{"name" : "NULL"}'); // Place the special 'flag' value for 'no match' into the response array (bc the client is expecting to get an array)

		res.writeHead(200, {'Content-Type' : 'application/json'});
		res.write(JSON.stringify(out));
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


function rtrvDB(topic, author, loc) {
	let queryString = "SELECT * FROM Clubs "; // Populate later with the SQL query string

	let response = ""; // Populate later with what will be returned to the user
	
	/////
	// Check what fields were passed by the user, and create the SQL query accordingly:
	/////
	
	// NONE GIVEN (send all to the client):
	if (topic == "empty" && author == "" && loc == "empty") { queryString += ";"; }
	// ALL GIVEN:
	else if (topic != "empty" && author != "" && loc != "empty") { queryString += "WHERE genre='" + parseGenreCode(topic) + "' AND author='" + author + "' AND region='" + parseLocCode(loc) + "';"; }
	// ALL BUT TOPIC:
	else if (topic == "empty" && author != "" && loc != "empty") { queryString += "WHERE author='" + author + "' AND region='" + parseLocCode(loc) + "';"; }
	// ALL BUT AUTHOR:
	else if (topic != "empty" && author == "" && loc != "empty") { queryString += "WHERE genre='" + parseGenreCode(topic) + "' AND region='" + parseLocCode(loc) + "';"; }
	// ALL BUT LOCATION:
	else if (topic != "empty" && author != "" && loc == "empty") { queryString += "WHERE genre='" + parseGenreCode(topic) + "' AND author='" + author + "';"; }
	// ONLY TOPIC:
	else if (topic != "empty" && author == "" && loc == "empty") { queryString += "WHERE genre='" + parseGenreCode(topic) + "';"; }
	// ONLY AUTHOR:
	else if (topic == "empty" && author != "" && loc == "empty") { queryString += "WHERE author='" + author + "';"; }
	// ONLY LOCATION:
	else if (topic == "empty" && author == "" && loc != "empty") { queryString += "WHERE region='" + parseLocCode(loc) + "';"; }
	
	let connection_pool = mysql.createPool(connectionObj_IT);
	connection_pool.query(queryString, function (error, results, fields) {
		if (error) {
			console.log("ERROR: ", error);
			console.log("RESPONSE: ", response);
			connection_pool.end();
		} else {
			console.log("CONNECTION SUCCESS -- PLEASE FINISH CODE HERE");
			connection_pool.end();

			response = ""; //EDIT THIS, THIS IS TO BE RETURNED T 'parseQuery'!
		} // End if/else block
	
	}); //call back function
	
//	connection_pool.end();  // Connection is closed in the above '.query' function
	
	return response;
}


function sendTicket(res, req){
	// If these are empty, replace them with a space (necessary for proper uery):
	req.email = req.email=="" ? " " : req.email;
	req.title = req.title=="" ? " " : req.title;
	req.issue = req.issue=="" ? " " : req.issue;

	let queryString = "INSERT INTO it_ticket_form VALUES ('" + req.email + "', '" + req.title + "', '" + req.issue + "');";
	console.log(queryString);

	let connection_pool = mysql.createPool(connectionObj_IT);
	connection_pool.query(queryString, function (error, results) {
		if (error) {
			console.log("ERROR: ", error);
			callback(error, null);
		} else {
			console.log("CONNECTION SUCCESS");

			console.log(results);
			callback(null, results);
		} // End if/else
	}); // Callback function*/
}

function listIT(res){
	let queryString = "SELECT * FROM it_ticket_form;";
	
	let connection_pool = mysql.createPool(connectionObj_IT);
	connection_pool.query(queryString, function (error, results) {
		if (error) {
			console.log("ERROR: ", error);
			callback(error, null);
		} else {
			console.log("CONNECTION SUCCESS");

			console.log(results);
			callback(null, results);

			res.writeHead(200, {'Content-Type' : 'tex.plain'});
			res.write(results);
			res.end();
		} // End if/else
	}); // Callback function*/
}


// Main function, decides which other function to call to server the client's request:
serveStatic = function (req, res) {
	q = url.parse(req.url, true);
	
	let fileName = q.pathname;
	console.log(fileName);
	
	let patternJS = /.js$/;
	let patternCSS = /.css$/;
	let patternHTML = /.html$/;
	let patternIMG = /(.png|.jpg)$/;

	// Add appropriate path prefix to files by the file type:
	if (fileName == "/" || fileName == "/index.html") fileName = "./index.html"; // If no file name is specified in the query, send  the index page
	else if (patternJS.test(fileName)) fileName = "./src/js" + fileName;
	else if (patternCSS.test(fileName)) fileName = "./src/css" + fileName;
	else if (patternHTML.test(fileName)) fileName = "./src/pages" + fileName;
	else if (patternIMG.test(fileName)) fileName = "./public" + fileName;

	console.log("FILENAME ", fileName);

	switch (fileName){
		case "/search":
			parseSearch(res, q.query);
			break;
		case "/itticket":
			sendTicket(res, q.query);
			break;
		case "/listit":
			listIT(res);
			break;
		case "/favicon.ico":
				break;
		default:
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

