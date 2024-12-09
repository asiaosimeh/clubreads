//Front end script to modify user info

urlPrefix = "http://35.196.73.111";

if (name != null && name != "null"){
	        document.getElementById("welcomeMsg").innerHTML = "Welcome, " + name + "!";
} else {
	        window.alert("ERROR - Member name not found!");
	        window.location.href = "index.html";
}

document.getElementById("submit").addEventListener("click", function() {
	//Grabing data from the form
	let fName = document.getElementById("fName").value;
	let lName = document.getElementById("lName").value;
	let bio = document.getElementById("bio").value;
	let pub_email = document.getElementById("pub_email").value;

	console.log("INPUT: ", fName, lName, bio, pub_email);

	if (checkFormat(fName, lName, bio, pub_email)){
		let reqURL = urlPrefix + "/updateProfile?fName=" + fName + "&lName=" + lName + "&bio="+ encodeURIComponent(bio) + "&pub_email=" + pub_email + "&hostid=" + sessionStorage.getItem("userid");
	console.log(reqURL);
		fetch(reqURL)
			.then(response =>{
console.log(response);
				if (!response.ok) {throw new Error("Network Error");}
					return response.json();
			})
			.then(data =>{
console.log("We got something");
				let after_save = document.getElementById("after_save");
				after_save.innerHTML = `
				<p>Profile updated successfully!</p>
				<p>First Name: ${fName}</p>
				<p>Last Name: ${lName}</p>
				<p>Public Email: ${pub_email}</p>
				<p>Bio: ${bio}</p>
				`;
			})
			.catch(error =>{
				console.error("Error with Fetch operation: ", error);
			})
	}
});
console.log("Done with fetch");
function checkFormat(fName, lName, bio, pub_email) {
	if(fName ==""|| lName == "" || bio == "" || pub_email == ""){
		window.alert("Please fill out all fields.")
		return false;
	}

	if(!pub_email.includes("@")) {
	window.alert("Please enter a valid email address.");
	return false;
	}

	return true;
}

document.getElementById("logout").addEventListener("click", function(){
	        window.location.href = "logout.html";

document.getElementById('backToMbdash').addEventListener('click', function (){
	window.location.href = urlPrefix + "/mbdash.html";

});
