package com.cutlab;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.dao.Utility;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/VerifyEmail")
public class VerifyEmail extends HttpServlet{

	private static final long serialVersionUID = 1L;
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Map<String, String> jsonResponse = new HashMap<>();
		
		HttpSession session = request.getSession(false); // false = don't create new session if doesn't exist
        if (session != null) {
            String verificationCode = (String) session.getAttribute("verificationCode"); 
            String verificationEmail = (String) session.getAttribute("verificationEmail");
                        
            if (verificationCode != null) {
                String userEnteredCode = request.getParameter("code").trim();
                
                String userEnteredEmail = request.getParameter("email").trim();
                
                if (verificationCode.equals(userEnteredCode)) {                    
                    if(verificationEmail.equals(userEnteredEmail)) {
                    	jsonResponse.put("status", "success");
                    	jsonResponse.put("message", "Verification Code matched!");
                    	Utility.sendJsonResponse(response, jsonResponse);
                    	session.setMaxInactiveInterval(60*5); //300sec = 5 min
                    	return;
                    }else {
                    	jsonResponse.put("status", "fail");
                    	jsonResponse.put("message", "Invalid Email!");
                    	Utility.sendJsonResponse(response, jsonResponse);
                    	return;
                    }
                } else {
                	jsonResponse.put("status", "fail");
                	jsonResponse.put("message", "Invalid Code!");
                	Utility.sendJsonResponse(response, jsonResponse);
                	return;
                }
            } else {
            	jsonResponse.put("status", "fail");
            	jsonResponse.put("message", "No verification code found!");
            	Utility.sendJsonResponse(response, jsonResponse);
            	return;
            }
        } else {
        	jsonResponse.put("status", "fail");
        	jsonResponse.put("message", "Session expired!");
        	jsonResponse.put("session", "expired");
        	Utility.sendJsonResponse(response, jsonResponse);
        	return;
        }
    }
	
}