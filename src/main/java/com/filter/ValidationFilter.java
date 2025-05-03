package com.filter;

import java.io.IOException;
import java.util.HashMap;

import com.dao.Utility;
import com.dao.Validation;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebFilter(urlPatterns = {"/LoginProcess", "/SignupProcess", "/SendEmail", "/VerifyEmail"})
public class ValidationFilter implements Filter {

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		
		HttpServletRequest request = (HttpServletRequest)req;
		HttpServletResponse response = (HttpServletResponse)res;
		
		HashMap<String, String> jsonResponse = new HashMap<>();
		
		String email = request.getParameter("email");
		String password =  request.getParameter("password");
		String confirmPass = request.getParameter("confirmPass");
		String code = request.getParameter("code");
		String flag =request.getParameter("flag");
		String actionType = request.getParameter("actionType");
		
		if(email != null) {
			String emailError = Validation.validateEmail(email);
			if(!emailError.isEmpty()) {
				jsonResponse.put("status", "fail");
				jsonResponse.put("message", emailError);
				Utility.sendJsonResponse(response, jsonResponse);
				return;
			}			
		}
		if(password != null) {
			String passwordError = Validation.validatePassword(password);
			if(!passwordError.isEmpty()) {
				jsonResponse.put("status", "fail");
				jsonResponse.put("message", passwordError);
				Utility.sendJsonResponse(response, jsonResponse);
				return;
			}		
		}
		if(confirmPass != null) {
	        String confirmError = Validation.confirmPassword(password, confirmPass);
	        if(!confirmError.isEmpty()) {
	        	jsonResponse.put("status", "fail");
	        	jsonResponse.put("message", confirmError);
	        	Utility.sendJsonResponse(response, jsonResponse);
	        	return;
	        }
		}
		if(code != null) {
			if(code.isEmpty() || code.length()<4) {
				jsonResponse.put("status", "fail");
	        	jsonResponse.put("message", "Invalid Code!");
	        	Utility.sendJsonResponse(response, jsonResponse);
	        	return;
			}
		}
		if(flag != null) {
			if(!flag.equalsIgnoreCase("CreateAccount") && !flag.equalsIgnoreCase("ResetPassword")) {
	        	jsonResponse.put("status", "fail");
	        	jsonResponse.put("message", "Invalid Attempt!");
	        	Utility.sendJsonResponse(response, jsonResponse);
	        	return;
	        }
		}
		if(actionType != null) {
			if(!actionType.equalsIgnoreCase("CreateAccount") && !actionType.equalsIgnoreCase("ResetPassword")) {
				jsonResponse.put("status", "fail");
				jsonResponse.put("message", "Invalid Attempt!");
				Utility.sendJsonResponse(response, jsonResponse);
				return;
			}
		}
		
		chain.doFilter(request, response);
		
	}

}
