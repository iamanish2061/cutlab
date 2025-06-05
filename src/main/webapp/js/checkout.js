document.addEventListener('DOMContentLoaded', function() {
    fetch('/cutlab/checkout?action=getTotalAmount')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                displayTotalAmount(data);
            } else {
                showToast('Failed to load cart: ' + data.message);
            }
        })
        .catch(error => {
            showToast('Error: ' + error.message);
        });

    function displayTotalAmount(data){
        const subTotal = $('#subtotal');
        subTotal.text(data.subtotal);
        const total = $('#total');
        total.text(data.total);
    }

    function getParams() {
        const params = {};
        const queryString = window.location.search;
        if (!queryString){
            return params;
        }
        const pairs = new URLSearchParams(queryString);
        for (const [key, value] of pairs.entries()) {
            params[key] = decodeURIComponent(value);
        }
        return params;
    }

    function setFieldValuesAndError(params) {
        // Set form field values
        const fieldNames = ["fullname", "address", "city", "state", "zip", "phone", "email"];
        fieldNames.forEach(name => {
            const input = document.getElementById(name);
            if (input && params[name]) {
                input.value = params[name];
            }
        });

        // Display error if exists
        if (params.error) {
            const errorBox = document.getElementById("error-shipping-msg");
            if (errorBox) {
				errorBox.classList.add("active");
                errorBox.textContent = params.error;
            }
        }
    }

       
    const params = getParams();
    setFieldValuesAndError(params);

});



document.getElementById('shippingFormBtn').addEventListener('submit', function(e) {
    e.preventDefault(); 
    const errorDisplay = document.getElementById('error-shipping-msg');
    var error;

    function displayError(error) {
        errorDisplay.innerText = error;
        errorDisplay.classList.add('active');
    }
    
    // Full Name validation
    const fullname = document.getElementById('fullname');
    error = validateFullName(fullname.value);
    if(error != "") {   
        displayError(error);
        return;
    }

    // Address validation
    const address = document.getElementById('address');
    error = validateAddress(address.value);
    if(error != "") {   
        displayError(error);
        return;
    }

    // City validation
    const city = document.getElementById('city');
    error = validateCity(city.value);
    if(error != "") {   
        displayError(error);
        return;
    }

    // State validation
    const state = document.getElementById('state');
    error = validateState(state.value);
    if(error != "") {
        displayError(error);
        return;
    }   

    // ZIP validation
    const zip = document.getElementById('zip');
    error = validateZip(zip.value);
    if(error != "") {   
        displayError(error);
        return;
    }

    // Phone validation
    const phone = document.getElementById('phone');
    error = validatePhone(phone.value);
    if(error != "") {   
        displayError(error);
        return;
    }

    // Email validation
    const email = document.getElementById('email');
    error = validateEmail(email.value);
    if(error != "") {   
        displayError(error);
        return;
    }

    // If all validations pass, submit the form
    document.getElementById('shippingForm').submit();
});
