  $(document).ready(function() {

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

    //inputting email
    $('#signup-email').on('input', function(){
        displayEmailError(this,"#email-signup-error-msg");
    });

    //inputting password
    $('#signup-password').on('input', function(){
        displayPasswordError(this,"#password-signup-error-msg", '#signup-confirm');
    });

    //confirming password
    $('#signup-confirm').on('input', function(){
        displayConfirmPasswordError("#signup-password", this, "#password-signup-error-msg");
    });

    //formatting date of datepicker
    $("#signup-dob").datepicker({
        dateFormat: "mm-dd-yy",
        changeMonth: true,
        changeYear: true,
        minDate: new Date(1900, 0, 1),
        maxDate: "+0Y"
    });

    //to send code to gmail account
    // promises and handler pani check garnu xa
    $('#sendCode').click(function(e) {
        e.preventDefault();
        const email = $('#signup-email').val().trim();
        const validEmail = validateEmail(email);
        const displayErrorMsg = $('#email-signup-error-msg');

        if(!email){
            displayErrorMsg.text('Please enter the email first!').css('color', 'red');
            return;
        }
        if(validEmail){
            displayErrorMsg.text(validEmail).css('color', 'red');
            return;
        }

        $('#sendCode').hide();
        sendVerificationCode(email, "CreateAccount", displayErrorMsg, function(success){
            if(success){
                $('#verificationCode').show();
            }else{
                $('#sendCode').show();
            }
        });
    });

    /* to verify email's code */
    $("#nextSection").click(function(e){
        e.preventDefault();

        const code = $('#random-generated-code').val().trim();
        const email = $('#signup-email').val().trim();
        const validEmail = validateEmail(email);
        const displayErrorMsg = $('#email-signup-error-msg');

        if(!email){
            displayErrorMsg.text('Please enter the email first!').css('color', 'red');
            return;
        }
        if(validEmail){
            displayErrorMsg.text(validEmail).css('color', 'red');
            return;
        }
        if(!code){
            displayErrorMsg.text('Please enter the code first!').css('color', 'red');
            return;
        }
        if (!/^\d{4}$/.test(code)){
        	displayErrorMsg.text('Invalid Code!').css('color', 'red');
            return;
        }
        verifyCode(code, email, displayErrorMsg, function(success){
            if(success){
                displayErrorMsg.text('Verification Code Matched!').css("color", "green");
                setTimeout(() => {
                    toggleContentOfSignupForm('email');
                    displayErrorMsg.text('');
                }, 1000);
            }
        });
    });

    // to submit login form
    $('#login-btn').click(function(e) {
        e.preventDefault();
        const email = $('#login-email').val().trim();
        const password = $('#login-password').val().trim();
        const displayMsg = $('#login-error-msg');

        const validEmail = validateEmail(email);
        const validPassword = validatePassword(password);

        if(!email){
            displayMsg.text('Please enter the email first!').css('color', 'red');
            return;
        }
        if(validEmail){
            displayMsg.text(validEmail).css('color', 'red');
            return;
        }
        if(!password){
            displayMsg.text('Please enter the password first!').css('color', 'red');
            return;
        }
        if(validPassword){
            displayMsg.text("Invalid Password!").css('color', 'red');
            return;
        }

        showToast('Logging in...');
        $('#login-btn').prop('disabled', true); //disabling login button to prevent more clicking

        setTimeout(() => {
            $.ajax({
            url: '/cutlab/LoginProcess',
            type: 'POST',
            dataType: 'json',
            data: 	{ 
                        email: email,
                        password: password
                    },
            success: function(response){
            if(response && response.status == 'success'){
                window.location.href = response.redirect;
            }else{
                displayMsg.text(response.message || 'Invalid Login Attempt!').css('color', 'red');
                $('#login-btn').prop('disabled', false);
            }
           },
           error: function(xhr){
                alert('Server busy. Please try again later!');
                $('#login-btn').prop('disabled', false);
            }
        });
        }, 1500);
        
    });

    // to submit signup form
    $('#signup-btn').click(function(e) {
        e.preventDefault();
        const email = $('#signup-email').val().trim();
        const code = $('#random-generated-code').val().trim();
        const password = $('#signup-password').val().trim();
        const confirmPass = $('#signup-confirm').val().trim();

        const displayMsg = $('#password-signup-error-msg');

        const validEmail = validateEmail(email);
        const validPassword = validatePassword(password);
        const validConfirm = confirmPassword(password, confirmPass);

        if(!email){
            displayMsg.text('Please enter the email first!').css('color', 'red');
            return;
        }
        if(validEmail){
            displayMsg.text(validEmail).css('color', 'red');
            return;
        }
        if(!code){
            displayMsg.text('Please enter the code first!').css('color', 'red');
            return;
        }
        if (!/^\d{4}$/.test(code)){
            displayMsg.text('Invalid Code!').css('color', 'red');
            return;
        }
        if(!password){
            displayMsg.text('Please enter the password first!').css('color', 'red');
            return;
        }
        if(validPassword){
            displayMsg.text(validPassword).css('color', 'red');
            return;
        }
        if(!confirmPass){
            displayMsg.text('Please re enter the password!').css('color', 'red');
            return;
        }
        if(validConfirm){
            displayMsg.text(validConfirm).css('color', 'red');
            return;
        }

        displayMsg.text('Please Wait...').css('color', 'blue');
        $('#signup-btn').prop('disabled', true); //disabling signup button to prevent more clicking

        verifyCode(code, email, displayMsg, function(success){
            if(success){
                $.ajax({
                    url: '/cutlab/SignupProcess',
                    type: 'POST',
                    dataType: 'json',
                    data: 	{ 
                                email: email,
                                password: password,
                                confirmPass: confirmPass,
                                actionType: "CreateAccount"
                            },
                    success: function(response){
                    if(response && response.status == 'success'){
                        alert ("Successfully Registered!");
                        window.location.href = response.redirect;
                    }else{
                        displayMsg.text(response.message || 'Invalid Data!').css('color', 'red');
                        $('#signup-btn').prop('disabled', false);
                    }
                   },
                   error: function(xhr){
                        alert('Server busy. Please try again later!');
                        $('#signup-btn').prop('disabled', false);
                    }
                });
            }else{
                displayMsg.text('Please verify email first!').css("color", "red");
                return;
            }
        });
    });

});





