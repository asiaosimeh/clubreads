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

});

function pasteData(data) {
	console.log("DATA RECIEVED: ", data);
}



