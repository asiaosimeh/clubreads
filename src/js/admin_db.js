let urlPrefix = "http://34.23.105.171"; //change to vm address
console.log('STARTING');
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

			.then(response => {
				if (!response.ok) {throw new Error("Network response not okay.");}
				return response.json();
			})
			.then(data => {
				console.log("Got: ", data);
				let output = document.getElementById("IT-topic-heading");
				output.innerHTML = "<br><h2>Testing<\h2><br>";
				for (e of data){
					output.innerHTML += "<h3 class='sector 1'> " +e.email+ "</h3>";
					output.innerHTML += "<h3 class='sector 2'> " +e.ticket_title+ "</h3>";
					output.innerHTML += "<h3 class='sector 2'> " +e.issue+ "</h3>";
					output.innerHTML += "<h3 class='sector 4'></h3>";
				}
			})
			.catch(error => {
				console.error("Error with fetch operation: ", error);
			});

			ticketBody.appendChild(row);
			}
		})

		.catch(error => {
			console.error("Error with fetch operation: ", error);
		});
});
