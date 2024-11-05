

function userPass(){
	let pass = document.getElementById('pass').value;
	let repeatpass = document.getElementById('repeat').value;


	
	if (pass === repeatpass){
		window.alert("Passwords match!");
	} else {
		window.alert("Passwords do not match, please enter same password");
		}
	
	
	let message = document.getElementById("results").value;
	
}

function validEmail(){
	
	let emailUser = document.getElementById('user').value;
	
	let message = document.getElementById('results').value;
	
	let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	
	if (emailRegex.test(emailUser)){
		message.textContent = "";
		
	} else{
		message.textContent = "Please enter a valid email address";
	}
}

console.log("The verification js file");
