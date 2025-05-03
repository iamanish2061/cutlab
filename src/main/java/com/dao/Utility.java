package com.dao;

import java.io.IOException;
import java.util.Map;

import com.google.gson.Gson;

import jakarta.servlet.http.HttpServletResponse;

public class Utility {
	
	public static void sendJsonResponse(HttpServletResponse response, Map<String, String> jsonResponse) throws IOException {
		response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String json = new Gson().toJson(jsonResponse);
        response.getWriter().write(json);
    }
	
}
