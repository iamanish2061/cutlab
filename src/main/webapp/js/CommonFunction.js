//validation of signup
function validateEmail(email){
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!pattern.test(email)) {
        return "Please enter valid email!";
    }
    return "";
}
//display error of email
function displayEmailError(inputSelector, displayMsg) {
    const email = $(inputSelector).val();
    let msg = validateEmail(email);
    $(displayMsg).text(msg);
}


function validatePassword(password){
    const pattern =/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[.@#$%&*]).{8,}$/;
    if(!pattern.test(password)){
        return 'Password must of be at 8 characters and must contain at least one number, one upper case, one lowercase , and one special char';
    }else{
        return '';
    }
}
//display error of password
function displayPasswordError(inputSelector, displayMsg, confirmPass) {
    const pass = $(inputSelector).val();
    let msg = validatePassword(pass);
    if(msg == ''){
        if($(confirmPass).val()){
            displayConfirmPasswordError(inputSelector, confirmPass, displayMsg);
        }else{
            $(displayMsg).text('');
        }
    }else{
        $(displayMsg).text(msg);
    }
}

function confirmPassword(password, confirmPass){
    if(password != confirmPass){
        return 'Password doesnot Match!';
    }else{
        return '';
    }
}
//display error of confirm password
function displayConfirmPasswordError(inputSelector, confirmSelector, displayMsg){
    const pass =  $(inputSelector).val();
    const confirm = $(confirmSelector).val();
    let msg = confirmPassword(pass, confirm);
    $(displayMsg).text(msg);
}

//to change the content of sign up form (prev and next)
function toggleContentOfSignupForm(section){
    var emailSection = document.getElementById('emailSection');
    var passwordSection = document.getElementById('passwordSection');
    emailSection.style.display= 'none';
    passwordSection.style.display= 'none';
    if(section == 'email'){
    	passwordSection.style.display= 'block';
    }else{
    	emailSection.style.display= 'block';
    }
}


//should make backend to validate email (for security) or check email with validation
//ajax to send code
//try us promises
function sendVerificationCode(email, actionType, displayMsg, callback){ //type mention what to do create account or reset password
    $.ajax({
        url: '/cutlab/SendEmail',
        type: 'POST',
        data: { email: email, flag: actionType  },
        success: function(response) {
            if(response.status == 'success'){
                displayMsg.text(response.message).css("color", "green");
                callback(true);
            }else{
                displayMsg.text(response.message).css("color", "red");
                callback(false);
            }
        },
        error: function(xhr) {
            alert('Failed to send code. Please try again.');
            callback(false);
        }
    });
}

//should make backend to validate email (for security) or check email with validation
//ajax to verify code
//try us promises
function verifyCode(code, email, displayErrorMsg, callback){ 
    $.ajax({
        url: '/cutlab/VerifyEmail',
        type: 'POST',
        data: 	{ 
                    code: code,
                    email: email
                },
       success: function(response){
        if(response.status == 'success'){
            callback(true);
        }else{
            displayErrorMsg.text(response.message).css("color", "red");
            if(response.session == "expired"){
                $('#verificationCode').hide();
                $('#sendCode').show();
            }
            callback(false);
        }
       },
       error: function(xhr){
            alert('Failed to verify code. Please try again.');
            callback(false);
        }
    });
}

function validateIdOrQuantity(num){
    let pattern = /^\d+$/;
    if (num == null || !pattern.test(num) || num<0) {
        return false;
    }else{
        return true;
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function updateCartButton(productId) {
    const cartBtn = document.getElementById('cart');
    fetch(`/cutlab/products?action=check&productId=${productId}`)
        .then(response => response.json())
        .then(data => {
            const buttonText = data.inCart ? "View Cart" : "Add to Cart";
            cartBtn.textContent = buttonText;
            sessionStorage.setItem(`cartButtonState_${productId}`, buttonText);
        })
        .catch(error => console.error('Error checking cart:', error));
}

function validateQueryOrCategory(query){
    // Validate query for allowed characters and length
    if (!/^[\w\s\-'.]{1,50}$/.test(query)) {
        showToast('Invalid search query. Please use only letters, numbers, spaces, and - \' . characters (max 50).');
        return false;
    }
    // Prevent HTML special characters in query
    if (/[<>&"]/g.test(query)) {
        showToast('Invalid search query. HTML special characters are not allowed.');
        return false;
    }
    return true;
}

//password toggle
function togglePassword(field, show, hide){
    const pwField = document.getElementById(field);
    const showIcon = document.getElementById(show);
    const hideIcon = document.getElementById(hide);

    if (pwField.type === 'password') {
        pwField.type = 'text';
        showIcon.style.display = '';
        hideIcon.style.display = 'none';
    } else {
        pwField.type = 'password';
        showIcon.style.display = 'none';
        hideIcon.style.display = '';
    }

}





































