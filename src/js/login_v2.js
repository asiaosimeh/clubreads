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
				sessionStorage.setItem("name", data.name);
				sessionStorage.setItem("userid", data.userid);
				sessionStorage.setItem("is_admin", data.is_admin); //added the is_admin boolean to the session storage... AGS
				
				//checking if the user logging in is an admin or not
				if (data.is_admin === 1){
					window.location.href = urlPrefix + "/admin_db.html";
				}else {
					window.location.href = urlPrefix + "/mbdash.html";
				}
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

