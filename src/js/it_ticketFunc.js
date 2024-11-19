let title = document.getElementById('title').value;
let email = document.getElementById('email').value;
let issue = document.getElementById('issue').value;
	
function createTicket(){
	
	
	let title = document.getElementById('title').value;
    let issue = document.getElementById('issue').value;
	
	if (title == "" || issue == ""){
		window.alert("Please enter missing fields.");
	} else if (title && issue){
		window.alert("Ticket created!");
	} else {
		window.alert("Please enter missing fields.");
	}
	
	

}

document.getElementById("submit").addEventListener("click", function(){
	createTicket();
	emailExists();
	
}

//Search database for email. 
//If it doesn't exist, put a popup.
function emailExists(){
	let email = document.getElementById('email').value;
	
	let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	
	if (!emailRegex.test(email)){
		window.alert("Please enter a valid email address");
	}
	//if email doesn't
	
}

console.log("IT ticket js file");
