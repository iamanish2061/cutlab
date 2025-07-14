package com.cutlab;

import java.io.IOException;
import java.util.HashMap;

import com.dao.Database;
import com.dao.Utility;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/GetProfilePicture")

public class GetProfilePicture extends HttpServlet{

	private static final long serialVersionUID = 1L;
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		
		HashMap<String, Object> jsonResponse = new HashMap<>();
		HttpSession session = request.getSession(false);		
		if(session == null || !session.getAttribute("loginStatus").equals(true) || session.getAttribute("user_id") == null) {
			jsonResponse.put("status", "fail");
            Utility.sendJsonResponse(response, jsonResponse);
            return;
		}
		int userId = Integer.parseInt(session.getAttribute("user_id").toString());
		
		Database db = new Database();
		String url = db.getProfileUrl(userId);
		
		jsonResponse.put("status", "success");
		jsonResponse.put("url", url);
		Utility.sendJsonResponse(response, jsonResponse);

		
	}

}
