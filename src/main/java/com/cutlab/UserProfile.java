package com.cutlab;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

import com.dao.Database;
import com.dao.Utility;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/getUserProfile")

public class UserProfile extends HttpServlet{

	private static final long serialVersionUID = 1L;
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		
		HashMap<String, Object> jsonResponse = new HashMap<>();
		HttpSession session = request.getSession(false);		
		if(session == null || !session.getAttribute("loginStatus").equals(true) || session.getAttribute("user_id") == null) {
			jsonResponse.put("status", "fail");
            jsonResponse.put("message", "User not logged in");
            Utility.sendJsonResponse(response, jsonResponse);
            return;
		}
		int userId = Integer.parseInt(session.getAttribute("user_id").toString());
		Database db = new Database();
		
		
		try {
			Object details = db.getUserProfileDetails(userId);
			jsonResponse.put("status", "success");
			jsonResponse.put("details", details);
			Utility.sendJsonResponse(response, jsonResponse);
			return;
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		}
		
		
	}

}
