// Script for the Member Dashboard page

urlPrefix = "http://35.196.73.111";

let name = sessionStorage.getItem("name");

if (name != null){
	document.getElementById("welcomeMsg").innerHTML = "Welcome, " + name + "!";
} else {
	window.alert("ERROR - Member name not found!");
	window.location.href = urlPrefix + "/";
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
	pasteBin.innerHTML = "";

	for (element of data){
		console.log(element);
		pasteBin.innerHTML += element;
	}
}

// Run the output command onload:
loadInfo();

