function validateFullName(fullName) {
    const pattern = /^[a-zA-Z\s]+$/;

    if (fullName.length < 5 || !pattern.test(fullName)) {
        return "Please enter a valid full name with at least 5 characters!";
    }
    return "";
}

function validateFirstAndLastName(name, val) {
    if (!val || val.trim() === "") {
        return "Please enter a valid"+ name + " with more than 2 characters and only alphabet!";
    }else{
        const pattern = /^[a-zA-Z\s]+$/;
        if (val.length < 2 || !pattern.test(val)) {
            return "Please enter a valid "+ name + " with more than 2 characters and only alphabet!";
        }
        return "";
    }
}

function validateAddress(address) {
    const pattern = /^[a-zA-Z0-9\s,.'-]{5,}$/;
    if (!pattern.test(address)) {
        return "Please enter a valid address with at least 5 characters!";
    }
    return "";
}

function validateCity(city) {
    const pattern = /^[a-zA-Z\s]+$/;
    if (!pattern.test(city)) {
        return "Please enter a valid city name!";
    }
    return "";
}

function validateState(state) {
    const pattern = /^[a-zA-Z\s]+$/;
    if (!pattern.test(state)) {
        return "Please enter a valid state name!";
    }
    return "";
}

function validateZip(zip) {
    const pattern = /^[0-9]{5,10}$/;
    if (!pattern.test(zip)) {
        return "Please enter a valid ZIP/Postal Code!";
    }
    return "";
}

function validatePhone(phone) {
    const pattern = /^[9]{1}[0-9]{9}$/;
    if (!pattern.test(phone)) {
        return "Please enter a valid phone number starting with 9!";
    }
    return "";
}

function validateEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!pattern.test(email)) {
        return "Please enter a valid email address!";
    }
    return "";
}

function validateDate(date){
    const pattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!pattern.test(date)) {
        return "Please enter a valid date in YYYY-MM-DD format!";
    }
    
    const today = new Date();
    const inputDate = new Date(date);
    
    if (inputDate > today) {
        return "The date cannot be in the future!";
    }
    
    return "";
}
