package com.cutlab;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dao.Database;
import com.dao.Products;
import com.dao.Utility;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/products")
public class ProductServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private Database db;
    
    @Override
    public void init() throws ServletException {
    	super.init();
        db = new Database(); 
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
    	
        String action = request.getParameter("action");
        Map<String, Object> responseData = new HashMap<>();
        List<String> categories = new ArrayList<>();
        
        try {
        	if(action == null) {
        		
        		try {
        			categories = db.getCategories();
        		} catch (ClassNotFoundException | SQLException e) {
        			e.printStackTrace();
        		}
                responseData.put("category", categories);
        		
        		List<Products> products = db.getAllProducts();
        		responseData.put("products", products);
        		responseData.put("status", "success");
        	}else if(action.equalsIgnoreCase("search")) {
        		String query = request.getParameter("query").trim();
        		List<Products> products = db.searchProducts(query);
        		responseData.put("products", products);
        		responseData.put("status", "success");
        	}else if(action.equalsIgnoreCase("category")) {
        		String category = request.getParameter("query").trim();
        		List<Products> products = db.searchProductsAccordingCategory(category);
        		responseData.put("products", products);
        		responseData.put("status", "success");
        	}else if(action.equalsIgnoreCase("specificProduct")) {
        		int productId = Integer.parseInt(request.getParameter("productId").trim());
        		Products products = db.getDetailsOfProduct(productId);
        		responseData.put("products", products);
        		responseData.put("status", "success");
        		
        		if(products != null) {
        			List<Products> recommendations = db.getRecommendedProducts(productId);
        			responseData.put("recommendations", recommendations);
        		}
        	}else if(action.equalsIgnoreCase("check")) {
        		//for button text
        		int productId = Integer.parseInt(request.getParameter("productId").trim());
        		int userId = -1;
        		HttpSession session = request.getSession(false);
                if (session !=null) {
                	if(session.getAttribute("loginStatus").equals(true)) {
                		userId = Integer.parseInt(session.getAttribute("user_id").toString());
                	}
                }
        		if(userId != -1) {
        			int qty = db.checkQuantity(productId, userId);
        			if(qty >= 1)
        				responseData.put("inCart", true);
        			else	
        				responseData.put("inCart", false);
        		}else {
        			responseData.put("inCart", false);
        		}
        	}
        }catch(SQLException | ClassNotFoundException e) {
        	response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            responseData.put("status", "error");
            responseData.put("message", "Database error: " + e.getMessage());
        }
        
        Utility.sendJsonResponse(response, responseData);
    }
        
}