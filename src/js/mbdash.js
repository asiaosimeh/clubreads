// Script for the Member Dashboard page

urlPrefix = "http://34.23.105.171";

let name = sessionStorage.getItem("name");

/*
let loggedOut = sessionStorage.getItem("loggedOut" === "true");

if (!name && !loggedOut){
	window.alert("ERROR - Member name not found!");
	window.location.href = urlPrefix +"/";
} else if (loggedOut) {
	sessionStorage.removeItem("loggedOut");
	window.location.href = urlPrefix + "/logout.html";
} else {
	document.getElementById("welcomeMsg").innerHTML = "Welcome, " + name + "!";
}
*/

if (name != null){
	document.getElementById("welcomeMsg").innerHTML = "Welcome, " + name + "!";
} else {
	window.alert("ERROR - Member name not found!");
	window.location.href = urlPrefix + "/logout.html"; //trying to figure out why the logout goes back to this if statement
}


function loadInfo() {
	reqUrl = urlPrefix + "/hostedclubs?id=" + sessionStorage.getItem("userid");

	fetch(reqUrl)
		.then(response => {
			if(!response.ok) {throw new Error("Network response not ok.");}
			return response.json();
		})
		.then(data => {
			console.log("RECIEVED: ", data);
			pasteData(data);
		})
		.catch(error => {
			console.error("Error with fetch operation: ", error);
		});
}

function pasteData(data){
	let pasteBin = document.getElementById("clubsList").innerHTML;
	console.log(pasteBin, pasteBin.innerHTML);
	document.getElementById("clubsList").innerHTML = "";

	for (element of data){
		console.log(element);
		document.getElementById("clubsList").innerHTML += "<br><details style='font-size:1.2em'><summary style='font-size:1.2em'>" + element[1] + "</summary><p style='font-size:1em'><strong>Book:</strong> " + element[2] + "<br><strong>Author:</strong> " + element[3] + "<br><strong>Genre:</strong> " + element[4] + "<br><strong>Meeting Day:</strong> " + element[5] +  "</p><button type='button' id='editClub" + element[0] + "' onclick='editClub()'>Edit Club</button></summary>";
	}
}

function editClub(){
	window.alert("Editing funcitonality coming soon!");
}

function logout(){
	sessionStorage.clear();
	sessionStorage.setItem("loggedOut", "true");
	window.location.href = urlPrefix + "/logout.html";
}

document.addEventListener ("DOMContentLoaded", function (){
	const logoutButton = document.getElementById("logout");
	if (logoutButton) {
		logoutButton.addEventListener("click", logout);
	}
});
// Run the output command onload:
loadInfo();

