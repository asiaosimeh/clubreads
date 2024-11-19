/*
 *
 * My Script. 
 *
 */

let urlPrefix = "http://35.196.73.111";

function myclick(){
	let topic = document.getElementById("genre").value;
	let author = document.getElementById("author").value;
	let loc = document.getElementById("loc").value;
	
	console.log("INPUT:\n");
	console.log(topic);
	console.log(author);
	console.log(loc);
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
			for (let e of dataList){
				console.log("ELEMENT: ", e);
					
				// Remove any previous output from prior searches, and output the new results to the page:
				
				outputBin.innerHTML += "<p><strong>" + e[1] + "</strong> | <strong>Meets:</strong> " + e[5] + "; <strong>Region:</strong> " + e[6] + "; <strong>Current book:</strong> " + e[2] + " by " + e[3] + "</p>";
			}
		} // End if/else-if/else block
		
}

document.getElementById("search").addEventListener("click", myclick);

