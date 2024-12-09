// Front end script for edit-existing-book-club form

urlPrefix = "http://34.23.105.171";

document.getElementById("submit").addEventListener("click", function(){
	// Define variables to collect the info from the form:
	let clubID = document.getElementById("clubID").value;
	let clubName = document.getElementById("clubName").value;
	let bookName = document.getElementById("bookName").value;
	let author = document.getElementById("author").value;
	let genre = document.getElementById("genre").value;
	let day = document.getElementById("day").value;
	let loc = document.getElementById("loc").value;
	let capacity = document.getElementById("capacity").value;
	let sdate = document.getElementById("sdate").value;
	let edate = document.getElementById("edate").value;

	console.log("INPUT: ", clubID, clubName, bookName, author, genre, day, loc, capacity, sdate, edate);
	//////////////////
	if (checkFormat(clubID, clubName, bookName, author, genre, day, loc, capacity, sdate, edate)){

	//console.log("INPUT: ", clubName, bookName, author, genre, day, loc, capacity, sdate, edate);
	
	let reqUrl = urlPrefix + "/editBC?"
	if (clubName != "") {reqUrl += "clubName=" + clubName}
		else {reqUrl += "clubName=no"}
	if (bookName != "") {reqUrl += "&bookName=" + bookName}
		else {reqUrl += "&bookName=no"}
	if (author != "") {reqUrl += "&author=" + author} 
		else {reqUrl += "&author=no"} 
	if (genre != "empty") {reqUrl += "&genre=" + genre}
		else {reqUrl += "&genre=no"}
	if (day != "empty") {reqUrl += "&day=" + day}
		else {reqUrl += "&day=no"}
	if (loc != "empty") {reqUrl += "&loc=" + loc}
		else {reqUrl += "&loc=no"}
	if (capacity != "") {reqUrl += "&capacity=" + capacity}
		else {reqUrl +="&capacity=no"}
	if (sdate != "") {reqUrl += "&sdate=" + sdate}
		else {reqUrl +="&sdate=no"}
	if (edate != "") {reqUrl += "&edate=" + edate}
		else {reqUrl += "&edate=no"}
	reqUrl += "&clubid=" + clubID; // Club ID cannot be empty
	
	// Send the URL request using Fetch API:
	fetch(reqUrl)
		.then(response => {
			if(!response.ok) {throw new Error("Network response not ok..");}
				return response.json();
		})
		.then(data => {
			console.log("RECIEVED: ", data);
			if (data.message == "success"){
				pasteData(data);
			}
		})
		.catch(error => {
			console.error("Error with Fetch operation: ", error);
		});
	// End Fetch operation
	
	} // End check for proper formatting
});

function pasteData(data) {
	console.log("DATA RECIEVED: ", data);
	window.alert("Update has been processed.");
	window.location.href = urlPrefix + "/mbdash.html";
}

function checkFormat(clubID, clubName, bookName, author, genre, day, loc, capacity, sdate, edate){
	// If nothing fails its format check, return true. Otherwise, return false:
	/////////
	let datePattern = /\d{4}[-]\d{2}[-]\d{2}/
	
	console.log(clubID);
	// Check that a value has been entered for every textbox field:
	if (!sessionStorage.getItem("clubIDList").split(",").includes(clubID)) {
		window.alert("Club with ID " + clubID + " either doesn't exist, or is not a club you host.\nPlease try a different value.");
		return false;
	} else if (clubName == "" && bookName == "" && author == "" && genre == "empty" && day == "empty" && loc == "empty" && capacity == "" && sdate == "" && edate == "") {
		window.alert("No changes made.");
		window.location.href = "mbdash.html";
	} else if (capacity != "" && capacity < 5) {
		window.alert("Cannot make a book club with less than 3 people.");
		return false;		
	} else if ( (sdate != "" && !sdate.match(datePattern)) || (edate != "" && !edate.match(datePattern))) {
		window.alert("Improper date format - Dates must be in YYYY-MM-DD format.");
	} else {
		return true;
	}
}
