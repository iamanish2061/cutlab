package com.cutlab;

import java.io.IOException;

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
        HttpSession session = request.getSession(false); // false = don't create new session if doesn't exist
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        if (session != null) {
            String verificationCode = (String) session.getAttribute("verificationCode"); // Retrieve the verification code
            String verificationEmail = (String) session.getAttribute("verificationEmail"); // Retrieve the verification code
            
            if (verificationCode != null) {
                String userEnteredCode = request.getParameter("code");
                String userEnteredEmail = request.getParameter("email");
                
                if (verificationCode.equals(userEnteredCode)) {                    
                    if(verificationEmail.equals(userEnteredEmail)) {
                    	response.getWriter().write("{\"status\":\"success\"}");
                    }else {
                    	response.getWriter().write("{\"status\":\"fail\", \"message\":\"Invalid Email!\"}");
                    }
                    
                } else {
                    response.getWriter().write("{\"status\":\"fail\", \"message\":\"Invalid code\"}");
                }
            } else {
                response.getWriter().write("{\"status\":\"fail\", \"message\":\"No verification code found\"}");
            }
        } else {
            response.getWriter().write("{\"status\":\"fail\", \"message\":\"Session expired\"}");
        }

        
    }
}