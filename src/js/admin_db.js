<<<<<<< HEAD

=======
>>>>>>> 37402879d6076d531d09a7862a6ea561d0b21a56
let urlPrefix = "http://35.196.73.111"; //change to vm address

document.getElementById('viewall').addEventListener("click", function(){
	let reqUrl = urlPrefix + "/adminIT";
	
	fetch(reqUrl)
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


});
