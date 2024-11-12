function validEmail(){
	
	let emailUser = document.getElementById('user').value;
	
	let message = document.getElementById('results');
	
	let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	
	if (emailRegex.test(emailUser)){
		message.textContent = "";
		console.log("A valid email address");
		
	} else{
		message.textContent = "Please enter a valid email address";
		console.log("Please enter valid email");
	}
}

function userPass(){
 
          let pass = document.getElementById('pass').value;
          let repeatpass = document.getElementById('repeat').value;
          let message = document.getElementById('results');
 
 
          if (pass === repeatpass){
                 message.textContent = "Passwords match";
                 console.log("Passwords match!");
         } else {
                 message.textContent = "Passwords don't match";
		 }
		 
}
console.log("The verification js file");
