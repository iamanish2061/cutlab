document.addEventListener('DOMContentLoaded', function() {

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
      const fieldNames = ["firstName", "lastName", "gender", "dob", "address", "phone"];
      fieldNames.forEach(name => {
        if(name=="gender"){
          if(params[name]){
            document.querySelector(`input[name="gender"][value="${params[name]}"]`).checked = true;
          }
        }else{
          const input = document.getElementById(name);
          if (input && params[name]) {
              input.value = params[name];
          }
        }
      });

      // Display error if exists
      if (params.error) {
        const toast = document.getElementById('toast');
        toast.textContent = params.error;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 5000);
      }
    }

       
    const params = getParams();
    setFieldValuesAndError(params);

});

function displayError(errorDescription, errorId) {
      const errorElement = document.getElementById(errorId);
      errorElement.textContent = errorDescription;
      errorElement.classList.add('show');
  }

  function removeError(errorId) {
      const errorElement = document.getElementById(errorId);
      errorElement.textContent = '';
      errorElement.classList.remove('show');
  }

  function checkName(name, nameId){
    const error = validateFirstAndLastName(name, document.getElementById(nameId).value);
    if(error != ""){
      displayError(error, "nameError");
    }else{
      removeError("nameError");
    }
  }

  function checkDate(dateId) {
    const error = validateDate(document.getElementById(dateId).value);
    if(error != ""){
      displayError(error, "dobError");
    }else{
      removeError("dobError");
    }
  }

  function checkAddress(addressId) {
    const error = validateAddress(document.getElementById(addressId).value);
    if(error != ""){
      displayError(error, "addressError");
    }else{
      removeError("addressError");
    }
  }

  function checkPhone(phoneId) {
    const error = validatePhone(document.getElementById(phoneId).value);
    if(error != ""){
      displayError(error, "phoneError");
    }else{
      removeError("phoneError");
    }
  }


  const form = document.getElementById('signup-form');
  const submitButton = document.getElementById('submitForm');

  submitButton.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent form submission for validation

      var error;

      // Name validation
      const fname = document.getElementById('firstName');
      error = validateFullName(fname.value);
      if(error != "") {   
          displayError(error, "nameError");
          return;
      }
      const lname = document.getElementById('lastName');
      error = validateFullName(lname.value);
      if(error != "") {   
          displayError(error, "nameError");
          return;
      }

      // gender validation
      const gender = document.getElementById('genderGroup');
      const genderRadios = gender.querySelectorAll('input[type="radio"]');
      let genderSelected = false;
      genderRadios.forEach(radio => {
          if (radio.checked) {
              genderSelected = true;
          }
      });
      if (!genderSelected) {
          displayError("Please select a gender.", "genderError");
          return;
      }else{
        removeError("genderError");
      }

      // Date of Birth validation
      const dob = document.getElementById('dob');
      error = validateDate(dob.value);
      if(error != "") {
          displayError(error, "dobError");
          return;
      }

      // Address validation
      const address = document.getElementById('address');
      error = validateAddress(address.value);
      if(error != "") {   
          displayError(error, "addressError");
          return;
      }

      // Phone validation
      const phone = document.getElementById('phone');
      error = validatePhone(phone.value);
      if(error != "") {   
          displayError(error, "phoneError");
          return;
      }

      // If all validations pass, submit the form
      form.submit();
  });
