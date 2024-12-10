
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


const connectionObj_Reg = {
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
			break;
		case "west":
			value = "West";
			break;
		case "empty":
			value = "";
			break;
	} // End switch/case

	return value;
} // End function

function parseDayCode(dayCode){
	let value = "";

	switch(dayCode){
		case "Su":
			value = "Sunday";
			break;
		case "M":
			value = "Monday";
			break;
		case "Tu":
			value = "Tuesday";
			break;
		case "W":
			value = "Wednesday";
			break;
		case "Th":
			value = "Thursday";
			break;
		case "F":
			value = "Friday";
			break;
		case "Sa":
			value = "Saturday";
			break;
		case "empty":
			value = "";
			break;
	}

	return value;
}


function parseSearch(res, search){
	rtrvDB(search.topic,search.author,search.loc,search.day, (err,results) =>{
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


function rtrvDB(topic, author, loc, day, callback) {
	let queryString = "SELECT Clubs.club_id, Clubs.club_name, Clubs.book_name, Clubs.author, Clubs.genre, Clubs.meeting_day, Clubs.region, Users.public_email, Users.first_name, Users.last_name, Users.bio FROM Clubs INNER JOIN Users ON Clubs.hosted = Users.user_id "; // Populate later with the SQL query string

	/////
	// Check what fields were passed by the user, and create the SQL query accordingly:
	/////
	
	// NONE GIVEN (send all to the client):
	if (topic == "empty" && author == "" && loc == "empty" && day == "empty") { queryString += ";"; }
	// ALL GIVEN:
	else if (topic != "empty" && author != "" && loc != "empty" && day!="empty") { queryString += "WHERE genre='" + parseGenreCode(topic) + "' AND author='" + author + "' AND region='" + parseLocCode(loc) + "' AND meeting_day='" + parseDayCode(day) + "';"; }
	
	////////////////////
	// TRIPLES
	////////////////////
	
	// ALL BUT TOPIC:
	else if (topic == "empty" && author != "" && loc != "empty" && day != "empty") { queryString += "WHERE author='" + author + "' AND region='" + parseLocCode(loc) + "' AND meeting_day='" + parseDayCode(day) + "';"; }
	// ALL BUT AUTHOR:
	else if (topic != "empty" && author == "" && loc != "empty" && day != "empty") { queryString += "WHERE genre='" + parseGenreCode(topic) + "' AND region='" + parseLocCode(loc) + "' AND meeting_day='" + parseDayCode(day) + "';"; }
	// ALL BUT LOCATION:
	else if (topic != "empty" && author != "" && loc == "empty" && day != "empty") { queryString += "WHERE genre='" + parseGenreCode(topic) + "' AND author='" + author + "' AND meeting_day='" + parseDayCode(day) + "';"; }
	// ALL BUT DAY:
	else if (topic != "empty" && author != "" && loc != "empty" && day == "empty") { queryString += "WHERE genre='" + parseGenreCode(topic) + "' AND author='" + author + "' AND region='" + parseLocCode(loc) + "';"; }
	
	/////////////////////
	// DOUBLES
	/////////////////////
	
	// TOPIC AND AUTHOR:
	else if (topic != "empty" && author != "" && loc == "empty" && day == "empty") { queryString += "WHERE genre='" + parseGenreCode(topic) + "' AND author='" + author + "';"; }
	// TOPIC AND LOCATION:
	else if (topic != "empty" && author == "" && loc != "empty" && day == "empty") { queryString += "WHERE genre='" + parseGenreCode(topic) + "' AND region='" + parseLocCode(loc) + "';"; }
	// TOPIC AND DAY:
	else if (topic != "empty" && author == "" && loc == "empty" && day != "empty") { queryString += "WHERE genre='" + parseGenreCode(topic) + "' AND day='" + parseDayCode(day) + "';"; }
	// AUTHOR AND LOCATION:
	else if (topic == "empty" && author != "" && loc != "empty" && day == "empty") { queryString += "WHERE author='" + author + "' AND region='" + parseLocCode(loc) + "';"; }
	// AUTHOR AND DAY:
	else if (topic == "empty" && author != "" && loc == "empty" && day != "empty") { queryString += "WHERE author='" + author + "' AND meeting_day='" + parseDayCode(day) + "';"; }
	// LOCATION AND DAY:
	else if (topic == "empty" && author == "" && loc != "empty" && day != "empty") { queryString += "WHERE region='" + parseLocCode(loc) + "' AND meeting_day='" + parseDayCode(day) + "';"; }
	
	////////////////////
	// SINGLES
	////////////////////
	
	// ONLY TOPIC:
	else if (topic != "empty" && author == "" && loc == "empty" && day == "empty") { queryString += "WHERE genre='" + parseGenreCode(topic) + "';"; }
	// ONLY AUTHOR:
	else if (topic == "empty" && author != "" && loc == "empty" && day == "empty") { queryString += "WHERE author='" + author + "';"; }
	// ONLY LOCATION:
	else if (topic == "empty" && author == "" && loc != "empty" && day == "empty") { queryString += "WHERE region='" + parseLocCode(loc) + "';"; }
	// ONLY DAY:
	else if (topic == "empty" && author == "" && loc == "empty" && day != "empty") { queryString += "WHERE meeting_day='" + parseDayCode(loc) + "';"; }
	

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

	let connection_pool = mysql.createPool(connectionObj_Reg);
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
	
	let connection_pool = mysql.createPool(connectionObj_Reg);
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

//Display all submitted tickets on the ClubReads Admin's dashboard
function adminIT(res){
	
	let queryStr = "SELECT * FROM it_ticket_form;";

	
	let connection_pool = mysql.createPool(connectionObj_Reg);
	connection_pool.query(queryStr, function (error, results){
		if (error) {
			console.log("ERROR: ", error);
			res.writeHead(500, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({error: "Database error occurred."}));
		}
		else{
			console.log("Connection established");
			console.log(results);
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.write(JSON.stringify(results));
			res.end();
		}
	
	});
}

function registerUser(res, q) {
	console.log("REGISTER: ", q.username, q.email, q.fname, q.lname, q.pass);
	
	let queryString = "INSERT INTO Users (username, email, password_hash, first_name, last_name) VALUES ('" + q.username + "', '" + q.email + "', '"  + q.pass + "', '" + q.fname + "', '" + q.lname + "');";
	console.log(queryString);

	let connection_pool = mysql.createPool(connectionObj);
	connection_pool.query(queryString, function (error, results) {
		if (error) {
			console.log("ERROR: ", error);
		} else {
			console.log("CONNECTION SUCCESS");

			console.log(results);

			res.writeHead(200, {'Content-Type' : 'text/plain'});
			res.write(JSON.stringify({'message' : 'success'}));
			res.end();
		} // End if/else
	}); // Callback function*/
}

function createBC(res, query) {
	console.log("RECIEVED: ", query);

	// Write to DB:
	console.log(parseDayCode(query.day), query.author, query.edate, query.sdate)
	
	// Parse the dates recievd into 'Date' objects:
	/*let sdate = new Date(query.sdate);
		sdate = sdate.toISOString().substring(0, 10);
	let edate = new Date(query.edate);
		edate = edate.toISOString().substring(0, 10);*/

	let queryString = "INSERT INTO Clubs (club_name, book_name, author, genre, meeting_day, region, capacity, start_date, end_date, hosted) VALUES ('" + query.clubName + "', '" + query.bookName + "', '" + query.author + "', '" + parseGenreCode(query.genre) + "', '" + parseDayCode(query.day) + "','" + parseLocCode(query.loc) + "', " + query.capacity + ", '" + query.sdate + "', '" + query.edate + "', " + query.hostid +  ");";
	
	console.log("QUERY: ", queryString);

	let connection_pool = mysql.createPool(connectionObj);
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
	}); // Callback function
}

function editBC(res, query) {
	console.log("EDITING: ", query);

	queryString = "UPDATE Clubs SET ";
	
	let updateCounter = 0; // Keeps track of # of updated fields in the query, to deal with placing commas
	if (query.clubName != "no") {if (updateCounter !=0){queryString += ", "} queryString += "club_name='" + query.clubName + "'"; updateCounter += 1}
	if (query.bookName != "no") {if (updateCounter !=0){queryString += ", "} queryString += "book_name='" + query.bookName + "'"; updateCounter += 1}
	if (query.author != "no") {if (updateCounter !=0){queryString += ", "} queryString += "author='" + query.author + "'"; updateCounter += 1}
	if (query.genre != "no") {if (updateCounter !=0){queryString += ", "} queryString += "genre='" + parseGenreCode(query.genre) + "'"; updateCounter += 1}
	if (query.day != "no") {if (updateCounter !=0){queryString += ", "} queryString += "meeting_day='" + parseDayCode(query.day) + "'"; updateCounter += 1}
	if (query.loc != "no") {if (updateCounter !=0){queryString += ", "} queryString += "region='" + parseLocCode(query.loc) + "'"; updateCounter += 1}
	if (query.capacity != "no") {if (updateCounter !=0){queryString += ", "} queryString += "capacity='" + query.capacity + "'"; updateCounter += 1}
	if (query.sdate != "no") {if (updateCounter !=0){queryString += ", "} queryString += "start_date='" + query.sdate + "'"; updateCounter += 1}
	if (query.edate != "no") {if (updateCounter !=0){queryString += ", "} queryString += "end_date='" + query.edate + "'"; updateCounter += 1}
	
	queryString += " WHERE club_id=" + query.clubid;

	console.log("FINAL QUERY ", queryString);

	let connection_pool = mysql.createPool(connectionObj);
	connection_pool.query(queryString, function (error, results) {
		if (error) {
			console.log("ERROR: ", error);
		} else {
			console.log("CONNECTION SUCCESS");

			console.log(results);

			res.writeHead(200, {'Content-Type' : 'text/plain'});
			res.write(JSON.stringify({'message' : 'success'}));
			res.end();
		} // End if/else
	}); // Callback function
}

function loginUser(res, query) {
	let user = query.user;
	let pass = query.pass;
	
	let queryString = "SELECT * FROM Users;";
	
	let connection_pool = mysql.createPool(connectionObj);
	connection_pool.query(queryString, function (error, results) {
		if (error) {
			console.log("ERROR: ", error);
		} else {
			console.log("CONNECTION SUCCESS");

			console.log(results);

			outMessage = JSON.stringify({message : 'none'});

			// Check if the given user/password combo is in the DB, pass the answer to the user:
			for (e of results) {
				console.log("USERNAME:", e[1], "PASSWORD:", e[3]);
				console.log(e);
				
				if (e[1] == user && e[3] == pass) {
					// Send a message flagging that a match was found
					console.log("Login match");
					outMessage = JSON.stringify({message : 'match', name : e[4], userid : e[0], is_admin: e[7]}); //passing is_admin value... AGS
		
					match = true;
				} else { console.log(e[1], e[3]) }
				
			} // End for loop
			res.writeHead(200, {'Content-Type' : 'text/plain'});
			res.write(outMessage);
			res.end();
			
		}
	});
}


function hostedClubsList(res, query){
	console.log("QUERY :", query);
	let queryStr = "SELECT * FROM Clubs WHERE hosted=" + query.id + ";";

	
	let connection_pool = mysql.createPool(connectionObj);
	connection_pool.query(queryStr, function (error, results){
		if (error) {
			console.log("ERROR: ", error);
			res.writeHead(500, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({error: "Database error occurred."}));
		}
		else{
			console.log("Connection established");
			console.log(results);
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.write(JSON.stringify(results));
			res.end();
		}
	});
}
	


function editPF(res,query){
	console.log("Received: ", query);

	let queryString = "UPDATE Users SET first_name = '" +query.fName+ "', last_name ='" +query.lName + "', bio = '" + query.bio + "', public_email ='" +query.pub_email + "' WHERE user_id = " +query.hostid;

	let connection_pool = mysql.createPool(connectionObj);
	connection_pool.query(queryString, function (error, results) {
		if (error) {
			console.log("Error!", error);
		}else {
			console.log("Success!");
			console.log(results);

			res.writeHead(200, {'Content-Type':'text/plain'});
			res.write(JSON.stringify(results));
			res.end();
		}
	});
}


function delClub(res, query) {
	console.log("DELETING CLUB: ", query.id);

	let queryString = "DELETE FROM Clubs WHERE club_id=" + query.id;

	let connection_pool = mysql.createPool(connectionObj);
	connection_pool.query(queryString, function (error, results) {
		if (error) {
			console.log("Error!", error);
		} else {
			console.log("Success!");
			console.log(results);

			res.writeHead(200, {'Content-Type':'text/plain'});
			res.write(JSON.stringify({'message' : 'success'}));
			res.end();
		}
	});
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
	else if (fileName == "VM_IP.js" || fileName == "/VM_IP.js") fileName = "./VM_IP.js";
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
		case "/register":
			registerUser(res, q.query);
			break;
		case "/createBC":
			createBC(res, q.query);
			break;
		case "/editBC":
			editBC(res, q.query);
			break;
		case "/adminIT":
			adminIT(res);
			break;
		case "/login":
			loginUser(res, q.query);
			break;
		case "/hostedclubs":
			hostedClubsList(res, q.query);
			break;
		case "/updateProfile":
			editPF(res, q.query);
			break;
		case "/delclub":
			delClub(res, q.query);
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
