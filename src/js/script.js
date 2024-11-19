/*
 *
 * My Script. 
 *
 */

let urlPrefix = "http://34.23.105.171";

function myclick(){
	let topic = document.getElementById("genre").value;
	let author = document.getElementById("author").value;
	let loc = document.getElementById("loc").value;
	
	console.log("INPUT:\n");
	console.log(topic);
	console.log(author);
	console.log(topic);
	console.log("\n");

	let reqUrl = urlPrefix + "/search?" + "topic=" + topic + "&author=" + author + "&loc=" + loc;
	
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
		console.log("Pasting...");
		
		// Get the ouput span-element for printing to the screen:
		let outputBin = document.getElementById("out");
		
		// Remove whitespace, then parse the object sent back from the server (It gives errors if whitespace is not removed):
		let obj = JSON.parse( JSON.stringify(dataList).trim() );
		console.log("OBJ" + obj, "DATALSIT " + dataList);
		console.log(typeof(obj), (obj.name));

		// IF there were matches found to the user's search, then parse and output the response from the server:	
		outputBin.innerHTML = "<h2>Book clubs matching search:</h2>";
		
		for (e of dataList){
			console.log("ELEMENT: ", e);
			
			e = JSON.parse(e);
			
			if (e.name == "NULL") {
				outputBin.innerHTML = "<h2>No results found.</h2>";
				break;
			}
			
			// Remove any previous output from prior searches, and output the new results to the page:
			
			outputBin.innerHTML += "<p>" + e.name + "</p>";
		}
		
}

document.getElementById("search").addEventListener("click", myclick);

