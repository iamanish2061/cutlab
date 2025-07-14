package com.cutlab;

import java.io.IOException;
import java.util.HashMap;

import com.dao.Utility;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/checkLoginStatus")

public class CheckLoginStatus extends HttpServlet{

	private static final long serialVersionUID = 1L;
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		HashMap<String, Object> jsonResponse = new HashMap<>();
        HttpSession session = request.getSession(false);
        boolean loggedIn = (session != null && session.getAttribute("loginStatus") != null);

        jsonResponse.put("status", "success");
        jsonResponse.put("loginStatus", loggedIn);
        Utility.sendJsonResponse(response, jsonResponse);
    }

}
