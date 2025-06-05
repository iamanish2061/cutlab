package com.cutlab;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import com.dao.Database;
import com.dao.Utility;
import com.esewa.EsewaSignatureUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;


@WebServlet("/LoginProcess")
public class LoginProcess extends HttpServlet {
	private static final long serialVersionUID = 1L;
       

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Map<String, Object> jsonResponse = new HashMap<>();
        
		String email = request.getParameter("email").trim();        
        String password = request.getParameter("password").trim();
        Database db= new Database();
        try {
			if (db.checkIfEmailAlreadyExists(email)) {
				if(db.doesEmailAndPasswordMatch(email, password)) {
					// Creating new session (invalidating old one first for security)
	                HttpSession oldSession = request.getSession(false);
	                if (oldSession != null) {
	                    oldSession.invalidate();
	                }
	                HttpSession newSession = request.getSession(true);
	                newSession.setAttribute("loginStatus", true);
	                
	                if(db.returnId(email) > 0) {
	                	newSession.setAttribute("user_id", db.returnId(email));
	                }else {
	                	newSession.setAttribute("user_id", "Not Found");
	                }
	                newSession.setMaxInactiveInterval(60 * 60); //session timeout (1 hour)
	                jsonResponse.put("status", "success");
	            	jsonResponse.put("redirect", "products.html");  // Redirect if login is successful
	            	
	            	Utility.sendJsonResponse(response, jsonResponse);
	                return;
				}else {
					jsonResponse.put("status", "fail");
		        	jsonResponse.put("message", "Email and Password does not match!");
		        	Utility.sendJsonResponse(response, jsonResponse);
		        	return;
				}
			} else {
				jsonResponse.put("status", "fail");
	        	jsonResponse.put("message", "Invalid Credentials!");
	        	Utility.sendJsonResponse(response, jsonResponse);
	        	return;
			}
		} catch (ClassNotFoundException | SQLException | IOException e) {
			e.printStackTrace();
            jsonResponse.put("status", "error");
            jsonResponse.put("message", "Server error, please try again later.");
            Utility.sendJsonResponse(response, jsonResponse);
		}
        
    }
	
	

}
