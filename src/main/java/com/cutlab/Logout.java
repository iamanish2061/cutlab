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

@WebServlet("/logout")
public class Logout extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        Map<String, Object> jsonResponse = new HashMap<>();
        
        // Invalidate session if exists
        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate();
        }
 
        jsonResponse.put("status", "success");
        jsonResponse.put("message", "Logged out successfully");
        Utility.sendJsonResponse(res, jsonResponse);
    }
}