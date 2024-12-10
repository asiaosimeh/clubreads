//let urlPrefix = "http://34.23.105.171"; //change to vm address
console.log('STARTING');


if (name == null && name == "null"){
        window.alert("ERROR - Member name not found!");
        window.location.href = "index.html";
}

document.getElementById('viewall').addEventListener("click", function(){
	let reqUrl = urlPrefix + "/listit"; //changed from adminIT to listit
	console.log('clicked...');
	fetch(reqUrl)

		.then(response => {
			if (!response.ok) {throw new Error("Network response not okay.");}
			return response.json();
		})
		.then(data => {

/*AGS Creating a table structure to display the tickets */
			console.log("Got: ", data);
			let ticketBody = document.getElementById("ticketBody");
			ticketBody.innerHTML ="";

			for(let e of data) {
			let row = document.createElement("tr");

			let emailCell = document.createElement("td");
			emailCell.textContent = e.email;
			row.appendChild(emailCell);

			let titleCell = document.createElement("td");
			titleCell.textContent = e.ticket_title;
			row.appendChild(titleCell);

			let issueCell = document.createElement("td");
			issueCell.textContent = e.issue;
			row.appendChild(issueCell);

			ticketBody.appendChild(row);
			}
		})

		.catch(error => {
			console.error("Error with fetch operation: ", error);
		});
});

document.getElementById("logout").addEventListener("click", function(){
	window.location.href = "logout.html";
});
