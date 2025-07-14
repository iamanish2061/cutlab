package com.cutlab;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

import com.dao.Database;
import com.dao.User;
import com.dao.Utility;
import com.dao.Validation;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/ChangePassword")
public class ChangePassword extends HttpServlet{

	private static final long serialVersionUID = 1L;
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		
		HashMap<String, Object> jsonResponse = new HashMap<>();
		HttpSession session = request.getSession(false);		
		if(session == null || !session.getAttribute("loginStatus").equals(true) || session.getAttribute("user_id") == null) {
			jsonResponse.put("status", "fail");
            jsonResponse.put("message", "User not logged in");
            Utility.sendJsonResponse(response, jsonResponse);
            return;
		}		
		int userId = Integer.parseInt(session.getAttribute("user_id").toString());
		
		String currentPassword = request.getParameter("currentPassword");
		String newPassword = request.getParameter("newPassword");
		String confirmPassword = request.getParameter("confirmPassword");

		
		//validations
		if(currentPassword != null) {
			String passwordError = Validation.validatePassword(currentPassword);
			if(!passwordError.isEmpty()) {
				jsonResponse.put("status", "fail");
				jsonResponse.put("message", passwordError);
				Utility.sendJsonResponse(response, jsonResponse);
				return;
			}		
		}
		if(newPassword != null) {
			String nPasswordError = Validation.validatePassword(newPassword);
			if(!nPasswordError.isEmpty()) {
				jsonResponse.put("status", "fail");
				jsonResponse.put("message", nPasswordError);
				Utility.sendJsonResponse(response, jsonResponse);
				return;
			}		
		}
		if(confirmPassword != null) {
	        String confirmError = Validation.confirmPassword(newPassword, confirmPassword);
	        if(!confirmError.isEmpty()) {
	        	jsonResponse.put("status", "fail");
	        	jsonResponse.put("message", confirmError);
	        	Utility.sendJsonResponse(response, jsonResponse);
	        	return;
	        }
		}
		
		User u = new User();
		Database db = new Database();
		String email =null;
		try {
			email = db.getEmail(userId);
		} catch (ClassNotFoundException | SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		if(email != null) {
			u.setEmail(email);			
			boolean flag;
			try {
				flag = db.doesEmailAndPasswordMatch(email, currentPassword);
				if(flag) {
					u.setPassword(confirmPassword);
					boolean changeFlag = db.updatePassword(u);
					if(changeFlag) {
						jsonResponse.put("status", "success");
			        	jsonResponse.put("message", "Password changed successfully!");
			        	Utility.sendJsonResponse(response, jsonResponse);
			        	return;
					}else {
						jsonResponse.put("status", "fail");
			        	jsonResponse.put("message", "Failed to change password!");
			        	Utility.sendJsonResponse(response, jsonResponse);
			        	return;
					}
					
				}else {
					jsonResponse.put("status", "fail");
		        	jsonResponse.put("message", "Current password is incorrect!");
		        	Utility.sendJsonResponse(response, jsonResponse);
		        	return;
				}
			} catch (ClassNotFoundException | SQLException e) {
				e.printStackTrace();
			}
			
		}else {
			jsonResponse.put("status", "fail");
        	jsonResponse.put("message", "Invalid Attempt!");
        	Utility.sendJsonResponse(response, jsonResponse);
        	return;
		}
	
	
	}

}
