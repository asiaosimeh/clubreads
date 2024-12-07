// Second version of login.js

let urlPrefix = "http://34.23.105.171";

document.getElementById("submit").addEventListener("click", function () {
	let user = document.getElementById("username").value;
	let pass = document.getElementById("password").value;
	console.log("ENTERED: ", user, pass);

	if (user == "" || pass == "") {
		window.alert("Pleqase fill out all fields.");
	} else {
		console.log("CHECKING");
		sendInfo(user, pass);
	}
});

function sendInfo (user, pass) {
	let reqUrl = urlPrefix + "/login?user=" + user + "&pass=" + pass;
	console.log("SENDING", reqUrl);
	
	fetch(reqUrl)
		.then(response => {
			if(!response.ok) {throw new Error("Network response not ok.");}
			return response.json();
		})
		.then(data => {
			console.log("RECIEVED: ", data.message);
			if (data.message == "match") {
				window.alert("SUCCESSFUL LOGIN - WELCOME, " + data.name + " - FUNCTIONALITY COMING SOON");
				window.location.href = urlPrefix + "/";
			} else if (data.message == "none") {
				window.alert("Incorrect login or password.");
			} else {
				console.log("Something went wrong.");
			}
		})
		.catch(error => {
			console.log("Error with fetch operation", error);
		});
} // End function

