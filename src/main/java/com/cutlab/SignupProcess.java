package com.cutlab;

import java.io.IOException;
import java.net.URLEncoder;
import java.sql.SQLException;

import com.dao.Database;
import com.dao.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@WebServlet("/SignupProcess")
public class SignupProcess extends HttpServlet{

	private static final long serialVersionUID = 1L;
	
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Database db= new Database();
		User user= new User(); 
		String signupError="";
		user.setEmail(request.getParameter("signup-email"));
		user.setPassword(request.getParameter("signup-password"));
		
		boolean signupResult;
		try {
			signupResult = db.insertSignupData(user);
			if(signupResult) {
				signupError = "success";
			}else {
				signupError = "fail";
			}
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}
		response.sendRedirect("login.html?signup=" + URLEncoder.encode(signupError, "UTF-8"));
    }

}
