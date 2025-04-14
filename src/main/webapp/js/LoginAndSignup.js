document.addEventListener('DOMContentLoaded', function() {
  // Get elements from the DOM
  const signUpButton = document.getElementById('signup');
  const logInButton = document.getElementById('login');
  const container = document.querySelector('.form-container');

  // Toggle between login and signup views
  signUpButton.addEventListener('click', () => {
      container.classList.add('right-panel-active');
  });

  logInButton.addEventListener('click', () => {
      container.classList.remove('right-panel-active');
  });

})

//login ra signup ko password show hide
function passwordToggleShowHide(form, action){
    var passwordField;
    if(form == 'login'){
        passwordField = document.getElementById("login-password");
    }else if(form == 'signup'){
        passwordField = document.getElementById("signup-password");
    }else{
        passwordField = document.getElementById("signup-confirm");
    }

    if(action == 'in'){
        passwordField.type = 'text';
    }else if(action == 'out'){
        passwordField.type = 'password';
    }else{

    }

}



//validation of signup
var email_error = document.getElementById('email-signup-error-msg');
var password_error = document.getElementById('password-signup-error-msg');

var passwordFlag = 0;
var confirmPasswordFlag = 0;

function validateName(e_name, entered_id){
    const entered_name= document.getElementById(entered_id).value;
    let pattern = /^[a-zA-Z]{3,}$/;
    if(entered_name.toString().length < 3){
        first_error_msg.innerHTML = `${e_name} must be more than three characters`;
        if(e_name == 'First Name'){
	        total_filled[0]=0;			
		}else{
			total_filled[1]=0;
		}
    }
    else if(!pattern.test(entered_name)){
        first_error_msg.innerHTML = `${e_name} should only contain alphabets (a-z)`;
        if(e_name == 'First Name'){
	        total_filled[0]=0;			
		}else{
			total_filled[1]=0;
		}
    }
    else{
        first_error_msg.innerHTML = '';
        if(e_name == 'First Name'){
	        total_filled[0]=1;			
		}else{
			total_filled[1]=1;
		}
    }
    checkForNextButton();
}

function validateGender() {
    const isGenderSelected = document.querySelector('input[name="signup-gender"]:checked');
    if (!isGenderSelected) {
        return false;
    }
    return true;
}

function validateDate(entered_dob) {
    const dobValue = document.getElementById(entered_dob).value;

    if (!dobValue) {
        first_error_msg.innerHTML = 'Please select a date!';
        total_filled[2] = 0;
        return;
    }

    // Convert string to Date object (MM-DD-YYYY format)
    let dob = $.datepicker.parseDate("mm-dd-yy", dobValue);

    // Extract the year
    let year = dob.getFullYear();

    if (year < 1900 || year > 2022) {
        first_error_msg.innerHTML = 'Invalid date selection!!';
        total_filled[2] = 0;
    } else {
        first_error_msg.innerHTML = '';
        total_filled[2] = 1;
    }
	
	checkForNextButton();
}

function validateAddress(entered_address){
	const address = document.getElementById(entered_address).value;
	let pattern = /^[A-Za-z0-9\s,.-]+$/;
	if(address.toString().length < 3){
		first_error_msg.innerHTML = 'Address cant be this short!';
		total_filled[3]=0;
	}else if(!pattern.test(address)){
		first_error_msg.innerHTML = 'Address cant be this short!';
		total_filled[3]=0;
	}else{
		first_error_msg.innerHTML = '';
		total_filled[3]=1;
	}
	checkForNextButton();
}

function validateNumber(entered_num){
    const num= document.getElementById(entered_num).value;
    let pattern = /^[9]{1}[0-9]{9}$/;

    if(num.toString()[0] != '9'){
        first_error_msg.innerHTML = 'Number must starts with 9!';
        total_filled[4] = 0;
    }
    else if(!pattern.test(num)){
        first_error_msg.innerHTML = 'Number must be of 10 digits!'
        total_filled[4] = 0;
    }     
    else{
       first_error_msg.innerHTML = '';
        total_filled[4] = 1;
    }

	checkForNextButton();
}

function validateEmail(entered_email){
    const email = document.getElementById(entered_email).value;
    let pattern = /^[a-z0-9A-Z\.]+[@]{1}[a-z]+[.]{1}[a-z]{1,3}$/ ;
    if(!pattern.test(email)){
        email_error.innerText = "Invalid email !";
        $("#sendCode").hide();
    }else{
        email_error.innerText = "";
        $("#sendCode").show();
    }
}

function validatePassword(task){
    const password = document.getElementById('signup-password').value;
    const confirmPass = document.getElementById('signup-confirm').value;
    if(task == 'validate'){
        let pattern =/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[.@#$%&*]).{8,}$/;
        if(!pattern.test(password)){
            password_error.innerHTML = 'Password must of be at 8 characters and must contain at least one number, one upper case, one lowercase , and one special char';
            passwordFlag = 0;
        }else{
            password_error.innerHTML = '';
            passwordFlag = 1;
        }   
    }else{
        if(password != confirmPass){
            password_error.innerHTML = 'Password doesnot Match!';
            confirmPasswordFlag = 0;
        }else{
            password_error.innerHTML = '';
            confirmPasswordFlag = 1;
        }
    }

    if(passwordFlag == 1 && confirmPasswordFlag ==1){
        $('#signup-btn').show();
        password_error.innerText = ' ';
    }else{
        $('#signup-btn').hide();
    }
    
    if(confirmPass.trim() != "" && confirmPass == password){
			$('#signup-btn').show();
	}else{
		$('#signup-btn').hide();
	}
	
}

function showNextButton(direction){
    if(direction == 'next'){
        $('#email-page-next').show();
    }
}

function checkForNextButton(){
// 	const total_sum = total_filled.reduce((accumulator, currentValue) => {
//         return accumulator + currentValue;
//       }, 0);
      
//       if(total_sum == 5 && validateGender()){
//       	$("#first-page-next").show();
      	
//       	var code = $('#random-generated-code').val();
//       	if(code && code.toString().length == 4){
// 			if(emailFlag==1){
// 				$("#second-page-next").show();
				
// 				if(passwordFlag == 1 && confirmPasswordFlag ==1){
// 					$('#signup-btn').show();
// 					document.getElementById('errorBeforeSubmit').innerText = ' ';
// 				}else{
// 					$('#signup-btn').hide();
// 					document.getElementById('errorBeforeSubmit').innerText = 'Please fill the above fileds correctly!';
// 				}
				
// 			}else{
// 				$("#second-page-next").hide();
// 			}
// 		}
      	
// 	  }else{
// 		$("#first-page-next").hide();
// 		if(total_sum == 5 && !validateGender){
// 			first_error_msg.innerHTML = 'Please select Gender!';			
// 		}
// 	  }
}


//to change the content of sign up form (prev and next)
function toggleContentOfSignupForm(page){

    var firstContent = document.getElementById('email-part');
    var secondContent = document.getElementById('password-part');
    
    firstContent.style.display= 'none';
  	secondContent.style.display= 'none';
  
    if(page == 'email-page'){
    	secondContent.style.display= 'block';
    }else{
    	firstContent.style.display= 'block';
    }
  
}

function signupStatus(message){
	alert(message);
	window.location.href = "http://localhost:8080/cutlab/login.html";
}
