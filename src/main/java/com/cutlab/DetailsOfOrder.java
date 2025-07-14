package com.cutlab;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

import com.dao.Database;
import com.dao.Utility;
import com.dao.Validation;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/GetDetailsOfOrder")
public class DetailsOfOrder extends HttpServlet{

	private static final long serialVersionUID = 1L;
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		
		HashMap<String, Object> jsonResponse = new HashMap<>();
		HttpSession session = request.getSession(false);		
		if(session == null || !session.getAttribute("loginStatus").equals(true) || session.getAttribute("user_id") == null) {
			jsonResponse.put("status", "fail");
			jsonResponse.put("message", "Not Logged In!!");
            Utility.sendJsonResponse(response, jsonResponse);
            return;
		}
		
		String orderId = (String)request.getParameter("orderId");
		boolean result = Validation.isOrderIdValid(orderId);		
		
		if(result) {
			Database db = new Database();
			try {			
				Object orderDetails = db.getDetailsOfOrder(orderId);
				jsonResponse.put("orderDetails", orderDetails);
			} catch (ClassNotFoundException | SQLException e) {
				e.printStackTrace();
			}
			
			jsonResponse.put("status", "success");		
			Utility.sendJsonResponse(response, jsonResponse);
		}else {
			jsonResponse.put("status", "fail");		
			jsonResponse.put("message", "Invalid Order Id!!");		
			Utility.sendJsonResponse(response, jsonResponse);
		}
				
	}

}