package com.cutlab;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import com.dao.Database;
import com.dao.User;
import com.dao.Utility;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@WebServlet("/SignupProcess")
public class SignupProcess extends HttpServlet{

	private static final long serialVersionUID = 1L;
	
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Map<String, String> jsonResponse = new HashMap<>();
		
		String email = request.getParameter("email").trim();  
        String password = request.getParameter("password").trim();
        String actionType = request.getParameter("actionType").trim();
		
		Database db= new Database();
		User user= new User(); 
		user.setEmail(email);
		user.setPassword(password);
		if(actionType.equalsIgnoreCase("CreateAccount")) {
			boolean signupResult;
			try {
				signupResult = db.insertSignupData(user);
				if(signupResult) {
					jsonResponse.put("status", "success");
		        	jsonResponse.put("redirect", "login.html");
		        	Utility.sendJsonResponse(response, jsonResponse);
		        	return;
				}else {
					jsonResponse.put("status", "fail");
		        	jsonResponse.put("message", "Failed to store data!");
		        	Utility.sendJsonResponse(response, jsonResponse);
		        	return;
				}
			} catch (ClassNotFoundException | SQLException e) {
				e.printStackTrace();
				jsonResponse.put("status", "error");
	        	jsonResponse.put("message", "Server error, please try again later.");
	        	Utility.sendJsonResponse(response, jsonResponse);
	        	return;
			}
		}else if(actionType.equalsIgnoreCase("ResetPassword")) {
			boolean updateResult;
			try {
				updateResult = db.updatePassword(user);
				if(updateResult) {
					jsonResponse.put("status", "success");
		        	jsonResponse.put("redirect", "login.html");
		        	Utility.sendJsonResponse(response, jsonResponse);
		        	return;
				}else {
					jsonResponse.put("status", "fail");
		        	jsonResponse.put("message", "Failed to update data!");
		        	Utility.sendJsonResponse(response, jsonResponse);
		        	return;
				}
			} catch (ClassNotFoundException | SQLException e) {
				e.printStackTrace();
				jsonResponse.put("status", "error");
	        	jsonResponse.put("message", "Server error, please try again later.");
	        	Utility.sendJsonResponse(response, jsonResponse);
	        	return;
			}
		}else {
			jsonResponse.put("status", "fail");
        	jsonResponse.put("message", "Invalid Attempt!");
        	Utility.sendJsonResponse(response, jsonResponse);
        	return;
		}
		
    }

}
