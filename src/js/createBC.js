// Front end script for create-book-club form

urlPrefix = "http://35.196.73.111";

document.getElementById("submit").addEventListener("click", function(){
	// Define variables to collect the info from the form:
	let clubName = document.getElementById("clubName").value;
	let bookName = document.getElementById("bookName").value;
	let author = document.getElementById("author").value;
	let genre = document.getElementById("genre").value;
	let day = document.getElementById("day").value;
	let loc = document.getElementById("loc").value;
	let capacity = document.getElementById("capacity").value;
	let sdate = document.getElementById("sdate").value;
	let edate = document.getElementById("edate").value;

	console.log("INPUT: ", clubName, bookName, author, genre, day, loc, capacity, sdate, edate);
	//////////////////
	if (checkFormat(clubName, bookName, author, genre, day, loc, capacity, sdate, edate)){

	//console.log("INPUT: ", clubName, bookName, author, genre, day, loc, capacity, sdate, edate);
	
	let reqUrl = urlPrefix + "/createBC?clubName=" + clubName + "&bookName=" + bookName + "&author=" + author + "&genre=" + genre + "&day=" + day + "&loc=" + loc + "&capacity=" + capacity + "&sdate=" + sdate + "&edate=" + edate;
	
	// Send the URL request using Fetch API:
	fetch(reqUrl)
		.then(response => {
			if(!response.ok) {throw new Error("Network response not ok..");}
				return response.json();
		})
		.then(data => {
			console.log("RECIEVED: ", data);
			pasteData(data);
		})
		.catch(error => {
			console.error("Error with Fetch operation: ", error);
		});
	// End Fetch operation
	
	} // End check for proper formatting
});

function pasteData(data) {
	console.log("DATA RECIEVED: ", data);
	window.alert("Processed.");
}

function checkFormat(clubName, bookName, author, genre, day, loc, capacity, sdate, edate){
	// If nothing fails its format check, return true. Otherwise, return false:
	/////////
	let datePattern = /\d{4}[-]\d{2}[-]\d{2}/
	
	// Check that a value has been entered for every textbox field:
	if(clubName == "" || bookName == "" || author == "" || capacity == "" || sdate == "" || edate == "") {
		window.alert("Please fill out all fields.");
		return false;
	} else if (capacity < 5) {
		window.alert("Cannot make a book club with less than 3 people.");
		return false;		
	} else if (!sdate.match(datePattern) || !edate.match(datePattern)) {
		window.alert("Improper date format - Dates must be in YYYY-MM-DD format.");
	} else {
		return true;
	}
}

