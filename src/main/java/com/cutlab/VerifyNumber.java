package com.cutlab;

import java.io.IOException;
import java.sql.SQLException;

import com.dao.Database;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@WebServlet("/VerifyNumber")
public class VerifyNumber extends HttpServlet{

	private static final long serialVersionUID = 1L;
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Database db = new Database();
		String number = request.getParameter("number");

        boolean numberStatus;
		try {
			numberStatus = db.checkIfNumberAlreadyExists(number);
			response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        
	        if (numberStatus) {
	            response.getWriter().write("{\"status\":\"fail\", \"message\":\"Number already exist!\"}");
	        } else {
	            response.setStatus(HttpServletResponse.SC_OK); // 200
	            response.getWriter().write("{\"status\":\"success\"}");
	        }
	        
		} catch (ClassNotFoundException | SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        
        
    }

}