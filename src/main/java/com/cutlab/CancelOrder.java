package com.cutlab;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;

import com.dao.Database;
import com.dao.Utility;
import com.dao.Validation;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/CancelOrder")
public class CancelOrder extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
       
        HashMap<String, Object> jsonResponse = new HashMap<>();
        
        String orderId = (String)request.getParameter("id");
        
        boolean result = Validation.isOrderIdValid(orderId);
        
        if(result) {
        	Database db = new Database();
			try {			
				boolean completeFlag = db.processOrderCancellation(orderId);
				if(completeFlag) {
					jsonResponse.put("status", "success");	
					jsonResponse.put("message", "Successfully Cancelled!");
					Utility.sendJsonResponse(response, jsonResponse);
				}else {
					jsonResponse.put("status", "fail");		
					jsonResponse.put("message", "Failed to Cancel!");		
					Utility.sendJsonResponse(response, jsonResponse);
					return;
				}
				
			}catch (ClassNotFoundException | SQLException e) {
				jsonResponse.put("status", "fail");		
				jsonResponse.put("message", "Failed to Cancel. Internal Error!");		
				Utility.sendJsonResponse(response, jsonResponse);
				return;
			}
			
		}else {
			jsonResponse.put("status", "fail");		
			jsonResponse.put("message", "Invalid Order Id!!");		
			Utility.sendJsonResponse(response, jsonResponse);
		}
        
    }
}




// order items hatauney
// payment maa Left to be Refunded garney
// order CANCELLED