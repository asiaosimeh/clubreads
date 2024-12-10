/*
 *
 * My Script. 
 *
 */

//let urlPrefix = "http://35.196.73.111";

function myclick(){
	let topic = document.getElementById("genre").value;
	let author = document.getElementById("author").value;
	let loc = document.getElementById("loc").value;
	let day = document.getElementById("day").value;
	
	console.log("INPUT:\n");
	console.log(topic);
	console.log(author);
	console.log(loc);
	console.log(day);
	console.log("\n");

	let reqUrl = urlPrefix + "/search?" + "topic=" + topic + "&author=" + author + "&loc=" + loc + "&day=" + day;
	
	// Send the URL request using Fetch API:
	fetch(reqUrl)
		.then(response => {
			if (!response.ok) {throw new Error("Network response not ok.");}
			return response.json();
		})
		.then(data => {
			console.log("RECIEVED: ", data);
			pasteData(data);
		})
		.catch(error => {
			console.error("Error with fetch operation: ", error);
		});
	// End Fetch operation


}

function pasteData(dataList){
	console.log("Pasting...", dataList);

		// Get the ouput span-element for printing to the screen:
	let outputBin = document.getElementById("out");

		// Remove whitespace, then parse the object sent back from the server (It gives errors if whitespace is not removed):
		/*let obj = JSON.parse( JSON.stringify(dataList).trim() );
		console.log("OBJ" + obj, "DATALSIT " + dataList);
		console.log(typeof(obj), (obj.name));*/

		// IF there were matches found to the user's search, then parse and output the response from the server:	
	outputBin.innerHTML = "<h2>Book clubs matching search:</h2>";

	if (!Array.isArray(dataList)) {
			console.error("Data is not an array:", dataList);
			outputBin.innerHTML="<h2>No results found.</h2>";
			return;
	} else if (dataList.length == 0) {
			console.log("Empty response.");
			outputBin.innerHTML = "<h2>No results found.</h2>";
	} else{
		for (let i = 0; i < dataList.length; i++){
			let e = dataList[i];
			
			//outputBin.innerHTML += `<div class="club-container"><h3 class="club-name" onclick="toggleDetails('club-${i}')">${e[1]}</h3><div id="club-${i}" class="club-details" style="display: none;"><p><strong>Meets:</strong> ${e[5]}</p><p><strong>Region:</strong> ${e[6]}</p><p><strong>Current book:</strong> ${e[2]} by ${e[3]}</p><h4>Host Information: </h4><p><strong>Name:</strong> ${e.first_name || "N/A"} ${e.last_name ||""}</p><p><strong>Contact:</strong> ${e.public_email || "N/A"}</p><p><strong>Bio:</strong>${e.bio ||"No bio available"}</p></div></div>`;
			
			console.log(e);
			
			outputBin.innerHTML += "<details><summary style='font-size:1.2em'>" + e[1] + "</summary><p><strong>Book:</strong> " + e[2] + ", by " + e[3] + "<br><br><strong>Genre: </strong> " + e[4] + "<br><br><strong>Meeting Day:</strong> " + e[5] + "<br><br>----------------------<br><br><strong>Club Host:</strong> " + e[8] + " " + e[9] + "<br><br> <strong>Email:</strong> " + e[7] + "</p></details><br>";
		}
	} // End if/else-if/else block
}

function toggleDetails(id) {
	const details = document.getElementById(id);
	details.style.display = details.style.display === "none" ? "block" : "none";
}
document.getElementById("search").addEventListener("click", myclick);

