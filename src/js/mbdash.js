// Script for the Member Dashboard page

urlPrefix = "http://35.196.73.111";

function loadInfo() {
	reqUrl = urlPrefix + "/hostedClubs";

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
	for (element of data){
		console.log(element);
	}
}

