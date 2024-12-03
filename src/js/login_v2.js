// Second version of login.js

let urlPrefix = "http://35.196.73.111";

document.getElementById("submit").addEventListener("click", function () {
	let user = document.getElementById("username").value;
	let pass = document.getElementById("password").value;

	if (user == "" || pass == "") {
		window.alert("Pleqase fill out all fields.");
	} else {
		checkLogin(user, pass);
	}
});

// Function to check the user's credentials and ensure they exist inthe DB:
function checkLogin(user, pass) {
	let urlReq = urlPrefix + "/login?user=" + user + "&pass=";

	fetch(reqUrl)
		.then(response => {
			if(!response.ok) {throw new Error("Network response not ok.")};
			rerutn response.json();
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
}


