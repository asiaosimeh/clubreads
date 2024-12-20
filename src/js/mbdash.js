// Script for the Member Dashboard page

//urlPrefix = "http://34.23.105.171";

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

if (name != null && name != "null"){
	document.getElementById("welcomeMsg").innerHTML = "Welcome, " + name + "!";
} else {
	window.alert("ERROR - Member name not found!");
	window.location.href = "index.html";
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
	
	if (data == null || data == ""){
		document.getElementById("clubsList").innerHTML = "<h2>You are not currently hosting any clubs.</h2>";
	}
	
	// Initializing a list of club IDs hosted, for later use (editBC.js):
	let idList = ""; // Making this a string, it iwll be split into elements later

	for (element of data){
		console.log(element);
		document.getElementById("clubsList").innerHTML += "<br><details style='font-size:1.2em'><summary style='font-size:1.2em'>" + element[1] + "</summary><p style='font-size:1em'><strong>Club ID:</strong> " + element[0] + "<br><strong>Book:</strong> " + element[2] + "<br><strong>Author:</strong> " + element[3] + "<br><strong>Genre:</strong> " + element[4] + "<br><strong>Meeting Day:</strong> " + element[5] +  "</p></summary>";
		
		idList += element[0] + ",";
		
		/*let btn = document.getElementById(element[0].toString());
		console.log("BUTTON - ", btn, btn.innerHTML);
		btn.addEventListener("click", function(){
			window.alert("CLICKED BUTTON - ");
		});*/
	} // End for loop

	sessionStorage.setItem("clubIDList", idList);

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

document.getElementById("logout").addEventListener("click", function() {
	        window.location.href = "logout.html";
});



// If the 'deletc bc' button is clicked, show the deletion form:
document.getElementById("delBC").addEventListener("click", function() {
	document.getElementById("delBCForm").style.display = "block";

});

document.getElementById("delBCConfirm").addEventListener("click", function() {
	let delID = document.getElementById("delBCID").value;

	// Ensure the user can only delete clubs they host:
	if (delID == ""){
		document.getElementById("delBCForm").style.display = "none";
	} else if (sessionStorage.getItem("clubIDList").split(",").includes(delID)){
		console.log(sessionStorage.getItem("clubIDList").split(","));
		let conf = window.confirm("Are you sure you want to delete book club " + delID + "?");
		if (conf) {
			reqUrl = urlPrefix + "/delclub?id=" + delID;
			fetch(reqUrl)
				.then(response => {
					if(!response.ok) {throw new Error("Network response not ok.");}
					return response.json();
				})
				.then(data => {
					console.log("RECIEVED: ", data);
					if (data.message == "success"){
						window.alert("Deletion successful.");
						window.location.href = "";
					}
				})
				.catch(error => {
					console.error("Error with fetch operation: ", error);
				});
			

		} // End confirm if/else
		
		document.getElementById("delBCForm").style.display = "none";
	} else {
		window.alert("Invalid club ID.");
	}
});



