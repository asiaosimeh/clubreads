

function userPass(){
	let pass = document.getElementById('pass').value;
	let repeatpass = document.getElementById('repeat').value;
	
	if (pass == "" || repeatpass == ""){
		window.alert("Please fill out both password fields.");
	} else if (pass === repeatpass){
		window.alert("Passwords match!");
	} else {
		window.alert("Passwords do not match, please enter same password");
	}	
}

function validEmail(){
	
	let emailUser = document.getElementById('email').value;
		
	let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	
	if (!emailRegex.test(emailUser)){
		window.alert("Please enter a valid email address");
	}
}

document.getElementById("submitBtn").addEventListener("click", function (){
	validEmail();
	userPass();
});

console.log("The verification js file");