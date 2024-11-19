
// Import/Require modules:
const http = require('http');
const fs = require('fs');
const url = require('url');
const mysql = require('mysql2');

const connectionObj = {
	host	        : '35.237.115.8',
	user	        : 'asiaosimeh',
	password        : 'clubreads2024',
	database        : 'BookClubDB',
	connectionLimit : 10,
	rowsAsArray     : true
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

// Define an empty variable, to be used in 'fileType' function below:

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
		case "myst":
			value = "Mystery";
			break;
		case "hr":
			value = "Horror";
			break;
		case "rm":
			value = "Romance";
			break;
		case "sf":
			value = "Sci-Fi";
			break;
		case "ad":
			value = "Adventure";
			break;
		case "hst":
			value = "Historical";
			break;
		case "cmd":
			value = "Comedy";
			break;
		case "dm":
			value = "Drama";
			break;
		case "bio":
			value = "Biography";
			break;
		case "self":
			value = "Self-Help";
			break;
		case "cook":
			value = "Cooking";
			break;
		case "trv":
			value = "Travel";
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
			value = "Northeast";
			break;
		case "SE":
			value = "Southeast";
			break;
		case "NW":
			value = "Northwest";
			break;
		case "SW":
			value = "Southwest";
			break;
		case "MW":
			value = "Midwest";
		case "empty":
			value = "";
			break;
	} // End switch/case

	return value;
} // End function

function parseSearch(res, search){
	rtrvDB(search.topic,search.author,search.loc, (err,results) =>{
		if (err) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.write("Database error occurred");
			res.end();
		} else {
			res.writeHead(200, {'Content-Type':'application/json'});
			res.write(JSON.stringify(results)); //sends the rsults as JSON
			res.end();
		}
	});
}


function rtrvDB(topic, author, loc, callback) {
	let queryString = "SELECT * FROM Clubs "; // Populate later with the SQL query string

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
	

	console.log("Generated Query:", queryString); //debugging

	let connection_pool = mysql.createPool(connectionObj);
	connection_pool.query(queryString, function (error, results) {

		if (error) {
			console.log("ERROR: ", error);
			callback(error,null); //passes the error to the callback
		} else {
			console.log("CONNECTION SUCCESS");
			
			console.log(results);
			callback(null, results);
			
		} // End if/else block
	
	}); //call back function
	
}


function sendTicket(res, req){
	//ASHLEY TROUBLESHOOT 11/19
	//ensuring all fields are filled in to avoid invalid or empty values into the database
	//if any field is empty, send an error to the client
	if (!req.email || !req.title || !req.issue){
		res.writeHead(400, {'Content-Type' : 'application/json'});
		res.end(JSON.stringfy({error: "Must fill the require fields. Please attempt again with email, title, and issue."}));
		return;
	}

	let queryString = "INSERT INTO it_ticket_form VALUES ('" + req.email + "', '" + req.title + "', '" + req.issue + "');";
	console.log(queryString);

	let connection_pool = mysql.createPool(connectionObj_IT);
	connection_pool.query(queryString, function (error, results) {
		if (error) {
			 //this handles the SQL query erros by loging to debug and send 500 error to client
			//hopefully this works
			console.log("ERROR: ", error);
			res.writeHead(500, {'Content-Type' : 'application/json'});
			res.end(JSON.stringify({ error: "Database error occurred."}));
		} else {
			console.log("CONNECTION SUCCESS");

			console.log(results);
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(results));
			
		} // End if/else
	}); // Callback function*/
}

function listIT(res){
	let queryString = "SELECT * FROM it_ticket_form;";
	
	let connection_pool = mysql.createPool(connectionObj_IT);
	connection_pool.query(queryString, function (error, results) {
		if (error) {
			console.log("ERROR: ", error);
		} else {
			console.log("CONNECTION SUCCESS");

			console.log(results);

			res.writeHead(200, {'Content-Type' : 'text/plain'});
			res.write(JSON.stringify(results));
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

