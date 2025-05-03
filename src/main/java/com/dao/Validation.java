package com.dao;

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
	
	
}
