// Second version of login.js

let urlPrefix = "http://35.196.73.111";

document.getElementById("submit").addEventListener("click", function () {
	let user = document.getElementById("username").value;
	let pass = document.getElementById("password").value;
	console.log("ENTERED: ", user, pass);

	if (user == "" || pass == "") {
		window.alert("Pleqase fill out all fields.");
	} else {
		console.log("CHECKING");
		let reqUrl = urlPrefix + "/login?user=" + user + "&pass=" + pass;
	
		console.log("SENDING");
	
		fetch(reqUrl)
			.then(response => {
				if(!response.ok) {throw new Error("Network response not ok.");}
				return response.json();
			})
			.then(data => {
				console.log("RECIEVED: ", data);
				if (data.message == "existing") {
					window.alert("SUCCESSFUL LOGIN - FUNCTIONALITY COMING SOON");
					window.location.href = urlPrefix + "/";
				}
			})
			.catch(error => {
				console.log("Error with fetch operation", error);
			});
	} // End if/else which checks for all fields bweing filled
});

