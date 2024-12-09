
let urlPrefix = "http://34.23.105.171";

// Verify format of both password fields:
function userPass(){
	let pass = document.getElementById('pass').value;
	let repeatpass = document.getElementById('repeat').value;
	
	if (pass == "" || repeatpass == ""){
		window.alert("Please fill out both password fields.");
		return false;
	} else if (pass === repeatpass){
		//window.alert("Passwords match!");
		return true;
	} else {
		window.alert("Passwords do not match, please enter same password");
		return false;
	}	
}

// Verify format of email field:
function validEmail(){
	
	let emailUser = document.getElementById('email').value;
		
	let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	
	if (!emailRegex.test(emailUser)){
		window.alert("Please enter a valid email address");
		return false;
	} else {
		return true;
	}
}

function sendData(username, email, fname, lname, pass){
	let reqUrl = urlPrefix + "/register?" + "username=" + username + "&email=" + email + "&fname=" + fname + "&lname=" + lname + "&pass=" + pass;
	
	fetch(reqUrl)
		.then(response => {
			if(!response.ok) {throw new Error("Network response not ok.")};
			return response.json();
		})
		.then(data => {
			console.log("RECIEVED: ", data);
			if (data.message == "success") {
				window.alert("Registration successful.");
				window.location.href = urlPrefix + "/";
			}
		})
		.catch(error => {
			console.error("Error with fetch operation: ", error);
		}); // End Fetch operation
}

document.getElementById("submitBtn").addEventListener("click", function (){
	let username = document.getElementById("username").value;
	let email = document.getElementById("email").value;
	let fname = document.getElementById("fname").value;
	let lname = document.getElementById("lname").value;
	let pass = document.getElementById("pass").value; // Only taking 'pass' and not 'repeat' because info will only one needs to be sent to server if they match
	
	if (username=="" || fname=="" || lname=="") {
		window.alert("Please fill out all fields");
	} else if (validEmail() && userPass() && username!="" && fname!="" && lname!=""){
		console.log("INPUT: ", username, email, fname, lname, pass);
		sendData(username, email, fname, lname, pass);
	}
});

console.log("The verification js file");
