function userPass(){

	let pass = document.getElementById('pass').value;
	let repeatpass = document.getElementById('repeat').value;
	let message = document.getElementById('results');

	
	if (pass === repeatpass){
		message.textContent = "Passwords match";
		console.log("Passwords match!");
	} else {
		message.textContent = "Passwords don't match";
		console.log("Passwords do not match, please enter same password");
		}
	
	
	
}

function validEmail(){
	
	let emailUser = document.getElementById('user').value;
	let message = document.getElementById('results');
	
	let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	
	if (emailRegex.test(emailUser)){
		message.textContent = "";
		console.log("Valid email");
		
	} else{
		message.textContent = "Please enter a valid email address";
		console.log("Not valid");
	}
}

console.log("The verification js file");
