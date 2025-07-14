package com.dao;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;


public class Validation {
	
	public static String validateEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        if (email == null || email.trim().isEmpty()) {
            return "Email is required!";
        }
        if (!email.matches(emailRegex)) {
            return "Invalid email!";
        }
        return ""; // Empty string means valid
    }
	
	public static String validatePassword(String password) {
		String passwordRegex = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[.@#$%&*]).{8,}$";
		if (password == null || password.trim().isEmpty()) {
            return "Password is required!";
        }
        if (!password.matches(passwordRegex)) {
            return "Invalid password!";
        }
		return "";
	}
	
	public static String confirmPassword(String password, String confirmPassword) {
		if(!password.equals(confirmPassword)) {
			return "Password does not match!";
		}
		return "";
	}
	
	
	//product ko lagi validations
	
	public static String validateAction(String action) {
		List<String> actionList = Arrays.asList("search", "category", "specificproduct", "check", "add", "remove", "get", "update");

		if(actionList.contains(action.toLowerCase())) {
			return "";
		}else {
			return "Attempted to perform invalid action!";		
		}
	}
	
	 public static String validateQuery(String query) {
        if (query.trim().isEmpty()) {
            return "Search query or category parameter is required!";
        }else {
        	return "";
        }
	 }

	 public static String validateProductId(String productId) {
		    if (productId.trim().isEmpty()) {
		        return "Product ID parameter is required!";
		    }
		    
		    try {
		        Integer.parseInt(productId);
		    } catch (NumberFormatException e) {
		        return "Product ID must be a valid number!";
		    }
		    
		    return "";
		}
	 
	 public static String validateChangedQuantity(String p_id, String changedQty) {
		 Database db = new Database();
		    if (changedQty.trim().isEmpty()) {
		        return "Quantity parameter is required!";
		    }
		    
		    try {
		        Integer.parseInt(changedQty);
		    } catch (NumberFormatException e) {
		        return "Quantity must be a valid number!";
		    }
		    
		    int stock = db.checkRemainingQuantity(Integer.parseInt(p_id));
		    
		    if(Integer.parseInt(changedQty) <=0 || Integer.parseInt(changedQty)>stock) {
		    	return "Invalid Quantity!";
		    }
		    
		    return "";
		}
	
	 //shipping details ko laagi validation
	 public static String validateFullName(String fullName) {
	    String pattern = "^[a-zA-Z\\s]+$";
	    if (fullName.length() < 5) {
	    	return "The full name cant be this short!";
	    }
	    if(!fullName.matches(pattern)) {
	    	return "Please enter a valid full name without any numbers or special characters!";
	    }
	    return "";
	 }

	 public static String validateAddress(String address) {
	    String pattern = "^[a-zA-Z0-9\\s,.'-]{5,}$";
	    if (address.length() < 5) {
	    	return "The address should be at least 5 characters!";
	    }
	    if (!address.matches(pattern)) {
	        return "Please enter a valid address!";
	    }
	    return "";
	 }
	 
	 public static String validateCity(String city) {
	    String pattern = "^[a-zA-Z\\s]+$";
	    if (!city.matches(pattern)) {
	        return "Please enter a valid address!";
	    }
	    return "";
	}

	 public static String validateState(String state) {
	    String pattern = "^[a-zA-Z\\s]+$";
	    if (!state.matches(pattern)) {
	        return "Please enter a valid state name!";
	    }
	    return "";
	 }

	 public static String validateZip(String zip) {
		String pattern = "^[0-9]{5,10}$";
	    if (!zip.matches(pattern)) {
	        return "Please enter a valid ZIP/Postal Code!";
	    }
	    return "";
	 }

	 public static String validatePhone(String phone) {
		 String pattern = "^[9]{1}[0-9]{9}$";
		    if (!phone.matches(pattern)) {
		        return "Please enter a valid phone number starting with 9!";
		    }
		    return "";
		}

	 //email ko mathi nai xa ---
	 
	 public static String validatePayMethod(String payMethod) {
		 
		 if(payMethod.equalsIgnoreCase("esewa") || payMethod.equalsIgnoreCase("khalti")) {
			 return "";
		 }else {
			 return "Invalid Payment Method!";
		 }
		 
		 
	 }
	 
	 //signup additional ko laagi
	 public static String validateNameField(String field, String value) {
		 String pattern = "^[a-zA-Z\\s]+$";
		 if (value.length() < 2 || !value.matches(pattern)) {
	         return "Please enter a valid "+ field + " with more than 2 characters and only alphabet!";
	     }
	     return "";
	 }
	 
	 public static String validateGender(String gender) {
		List<String> genderList = Arrays.asList("male", "female", "others");
		if(genderList.contains(gender.toLowerCase())) {
			return "";
		}else {
			return "Invalid Gender!";		
		}
	 }
	 
	 public static String validateDob(String dateStr) {
	     // Check if the string matches the expected format using regex
	     if (!dateStr.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
	         return "Please enter a valid date in YYYY-MM-DD format!";
	     }

	     SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	     sdf.setLenient(false); // Strict parsing (invalid dates like 2023-02-30 will be rejected)

	     try {
	         // Parse using SimpleDateFormat then convert to sql.Date
	         java.util.Date parsedDate = sdf.parse(dateStr);
	         Date inputDate = new Date(parsedDate.getTime());
	         
	         Date today = new Date(System.currentTimeMillis()); // Current date in sql.Date

	         // Check if the date is in the future
	         if (inputDate.after(today)) {
	             return "The date cannot be in the future!";
	         }

	     } catch (ParseException e) {
	         return "Please enter a valid date!";
	     }

	     return ""; // Return empty string if validation passes
	 }
	 
	 public static String validateSource(String source) {
		 List<String> sourceList = Arrays.asList("products.html", "checkout.html", "profile.html");
			if(sourceList.contains(source.toLowerCase())) {
				return "";
			}else {
				return "Invalid Source!";		
			}
	 }
	 
	 //order id validation 
	 public static boolean isOrderIdValid(String orderId) {
		 if(!orderId.isEmpty()) {
			String pattern = "^[a-zA-Z0-9_-]+$";
		    if (orderId.matches(pattern)) {
		        return true;
		    }
		 }
		 return false;
	 }

     
}
