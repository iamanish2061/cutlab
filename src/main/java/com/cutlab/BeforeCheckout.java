package com.cutlab;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.dao.Database;
import com.dao.Utility;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/beforeCheckout")
public class BeforeCheckout extends HttpServlet{
	private static final long serialVersionUID = 1L;
	private Database db;
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		db = new Database();
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//for response
		Map<String, Object> jsonResponse = new HashMap<>();
		HttpSession session = request.getSession(false);
		
		@SuppressWarnings("unchecked")
		Map<Integer, Integer> cartData = (Map<Integer, Integer>) request.getAttribute("validatedCartData");
		int userId = Integer.parseInt(session.getAttribute("user_id").toString());
		
        // checking received data and validating quantity
	    for (Map.Entry<Integer, Integer> entry : cartData.entrySet()) {
	    	int qty = db.checkQuantity(entry.getKey(), userId);
	    	if(qty < 1 || qty != entry.getValue()) {
	    		jsonResponse.put("status", "fail");
	            jsonResponse.put("message", "Invalid Attempt by editing quantity or product Id manually!");
	            Utility.sendJsonResponse(response, jsonResponse);
	            return;
	    	}
	    }

        // responding
        jsonResponse.put("status", "success");
        jsonResponse.put("message", "Please Wait!");
        Utility.sendJsonResponse(response, jsonResponse);
    }

}

