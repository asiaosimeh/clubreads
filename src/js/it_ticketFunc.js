
let title = document.getElementById('title').value;
let email = document.getElementById('email').value;
let issue = document.getElementById('issue').value;

let urlPrefix  = "http://35.196.73.111";


function createTicket(){
	
	let email = document.getElementById("email").value;
	let title = document.getElementById('title').value;
	let issue = document.getElementById('issue').value;

	
	if (title == "" || issue == ""){
		window.alert("Please enter missing fields.");
	} else if (title && issue){
		window.alert("Ticket created!");

		storeTicket(email, title, issue);
		console.log(email, title, issue);
	} else {
		window.alert("Please enter missing fields.");
	}
	
	

}

document.getElementById("submit").addEventListener("click", function(){
	createTicket();
	emailExists();
	

}

);

document.getElementById("listTickets").addEventListener("click", function(){
	let reqUrl = urlPrefix + "/listit";

	fetch(reqUrl)
		.then(response => {
			if (!response.ok) {throw new Error("Networj response not ok.");}
			return response.json();
		})
		.then(data => {
			console.log("RECIEVED: ", data);
			let outputBin = document.getElementById("out");
			outputBin.innerHTML = "<br><h2>TICKETS:</h2><br>";
			for (e of data) {
				outputBin.innerHTML += "<p><strong>Email:</strong> " + e.email + "</p>";
				outputBin.innerHTML += "<p><strong>Title:</strong> " + e.ticket_title + "</p>";
				outputBin.innerHTML += "<p><strong>Issue description:</strong> " + e.issue + "</p><hr>";
			}
		})
		.catch(error => {
			console.error("Error with fetch operation: ", error);
		});
	// End fetch op
});


//Search database for email. 
//If it doesn't exist, put a popup.
function emailExists(){
	let email = document.getElementById('email').value;
	
	let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	
	if (!emailRegex.test(email)){
		window.alert("Please enter a valid email address");
	}
	//if email doesn't
	
}

console.log("IT ticket js file");



function storeTicket(email, title, issue){
	let reqUrl = urlPrefix + "/itticket?email=" + email + "&title=" + title + "&issue=" + issue;

	fetch(reqUrl)
		.then(response => {
			if (!response.ok) {throw new Error("Networj response not ok.");}
			return response.json();
		})
		.then(data => {
			console.log("RECIEVED: ", data);
			window.alert("Ticket sent.");
		})
		.catch(error => {
			console.error("Error with fetch operation: ", error);
		});
	// End fetch op
}





