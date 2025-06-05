package com.cutlab;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.dao.Database;
import com.dao.Products;
import com.dao.Utility;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/cart")
public class CartProcess extends HttpServlet {
	private static final Logger logger = Logger.getLogger(CartProcess.class.getName());
	
    private static final long serialVersionUID = 1L;

    private Database db;

    @Override
    public void init() throws ServletException {
        db = new Database();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    	
        Map<String, Object> jsonResponse = new HashMap<>();
        
        HttpSession session = request.getSession(false);
        if (session == null || !session.getAttribute("loginStatus").equals(true)) {
            jsonResponse.put("status", "fail");
            jsonResponse.put("message", "User not logged in");
            Utility.sendJsonResponse(response, jsonResponse);
            return;
        }
        
        String action = request.getParameter("action");
        if (action == null) action = "get";

        try {
        	int userId = Integer.parseInt(session.getAttribute("user_id").toString());
        	switch (action.toLowerCase()) {  // [NEW] Case insensitive action
            case "add":
                handleAddToCart(request, response, userId);
                break;

            case "update":
                handleUpdateCart(request, response, userId);
                break;

            case "remove":
                handleRemoveFromCart(request, response, userId);
                break;

            case "get":
            default:
                handleGetCart(request, response, userId);
                break;
        	}
        }catch (NumberFormatException e) {
            logger.log(Level.WARNING, "Invalid user ID format", e);
            jsonResponse.put("status", "fail");
            jsonResponse.put("message", "Invalid user session");
            Utility.sendJsonResponse(response, jsonResponse);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Unexpected error", e);
            jsonResponse.put("status", "fail");
            jsonResponse.put("message", "Server error occurred");
            Utility.sendJsonResponse(response, jsonResponse);
        }
    }
    
    private void handleAddToCart(HttpServletRequest request, HttpServletResponse response, int userId) 
            throws IOException, ClassNotFoundException, SQLException {
        
        Map<String, Object> jsonResponse = new HashMap<>();
        try {
            int productId = Integer.parseInt(request.getParameter("productId").trim());
            Products product = db.getDetailsOfProduct(productId);
            
            if (product == null) {
                jsonResponse.put("status", "fail");
                jsonResponse.put("message", "Product Not Found!");
                Utility.sendJsonResponse(response, jsonResponse);
                return;
            }
            
            int quantity = db.checkQuantity(productId, userId);    
            
            if (quantity >= 1) {
                jsonResponse.put("status", "fail");
                jsonResponse.put("message", "Please update quantity in cart!");
                Utility.sendJsonResponse(response, jsonResponse);
                return;
            }
            
            boolean result = db.insertIntoCart(productId, userId);
            jsonResponse.put("status", result ? "success" : "fail");
            jsonResponse.put("message", 
                result ? "Successfully Added to cart!" : "Failed to add to cart!");
            Utility.sendJsonResponse(response, jsonResponse);
            
        } catch (NumberFormatException e) {
            jsonResponse.put("status", "fail");
            jsonResponse.put("message", "Invalid product ID");
            Utility.sendJsonResponse(response, jsonResponse);
        }
    }

    private void handleUpdateCart(HttpServletRequest request, HttpServletResponse response, int userId) 
            throws IOException {
        
        Map<String, Object> jsonResponse = new HashMap<>();
        try {
            int productId = Integer.parseInt(request.getParameter("productId").trim());
            int quantity = Integer.parseInt(request.getParameter("change").trim());
            
            if (!db.checkIfProductExistInCart(productId, userId)) {
                jsonResponse.put("status", "fail");
                jsonResponse.put("message", "Product not in cart");
                Utility.sendJsonResponse(response, jsonResponse);
                return;
            }
            
            boolean result = db.updateCart(productId, userId, quantity);
            jsonResponse.put("status", result ? "success" : "fail");
            jsonResponse.put("message", 
                result ? "Updated Successfully!" : "Failed to update cart");
            Utility.sendJsonResponse(response, jsonResponse);
            
        } catch (NumberFormatException e) {
            jsonResponse.put("status", "fail");
            jsonResponse.put("message", "Invalid input format");
            Utility.sendJsonResponse(response, jsonResponse);
        } catch (ClassNotFoundException | SQLException e) {
            logger.log(Level.SEVERE, "Database error updating cart", e);
            jsonResponse.put("status", "fail");
            jsonResponse.put("message", "Database error occurred");
            Utility.sendJsonResponse(response, jsonResponse);
        }
    }

    private void handleGetCart(HttpServletRequest request, HttpServletResponse response, int userId) 
            throws IOException {
        
        Map<String, Object> responseData = new HashMap<>();
        try {
            Map<Integer, Integer> productIds = db.getProductsFromCart(userId);
            
            if (productIds.isEmpty()) {
                responseData.put("status", "success"); 
                responseData.put("message", "Your cart is empty");
                responseData.put("cart", new ArrayList<>());
            } else {
                List<CartItem> cartItems = new ArrayList<>();
                for (Map.Entry<Integer, Integer> entry : productIds.entrySet()) {
                	int p_id = entry.getKey();
                	int cartQty = entry.getValue();                	
                    Products product = db.getDetailsOfProduct(p_id);
                    if (product != null) {
                    	int remainingQty = db.checkRemainingQuantity(product.getId()) ;
                    	if(remainingQty > cartQty) {
                    		cartItems.add(new CartItem(product, cartQty));
                    	}else if(remainingQty < cartQty && remainingQty >0) {
                    		cartItems.add(new CartItem(product, remainingQty));
                    	}                 	
                    }
                }
                responseData.put("status", "success");
                responseData.put("cart", cartItems);
            }
            Utility.sendJsonResponse(response, responseData);
            
        } catch (ClassNotFoundException | SQLException e) {
            logger.log(Level.SEVERE, "Error getting cart details", e);
            responseData.put("status", "fail");
            responseData.put("message", "Error retrieving cart");
            Utility.sendJsonResponse(response, responseData);
        }
    }

    private void handleRemoveFromCart(HttpServletRequest request, HttpServletResponse response, int userId) 
            throws IOException {
        
        Map<String, Object> jsonResponse = new HashMap<>();
        try {
            int productId = Integer.parseInt(request.getParameter("productId").trim());
            
            if (!db.checkIfProductExistInCart(productId, userId)) {
                jsonResponse.put("status", "fail");
                jsonResponse.put("message", "Product not in cart");
                Utility.sendJsonResponse(response, jsonResponse);
                return;
            }
            
            boolean result = db.deleteFromCart(productId, userId);
            jsonResponse.put("status", result ? "success" : "fail");
            jsonResponse.put("message", 
                result ? "Removed from cart!" : "Failed to remove from cart");
            Utility.sendJsonResponse(response, jsonResponse);
            
        } catch (NumberFormatException e) {
            jsonResponse.put("status", "fail");
            jsonResponse.put("message", "Invalid product ID");
            Utility.sendJsonResponse(response, jsonResponse);
        } catch (ClassNotFoundException | SQLException e) {
            logger.log(Level.SEVERE, "Database error removing from cart", e);
            jsonResponse.put("status", "fail");
            jsonResponse.put("message", "Database error occurred");
            Utility.sendJsonResponse(response, jsonResponse);
        }
    }
        		
    

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String action = request.getParameter("action");
        if ("get".equalsIgnoreCase(action)) {
            doPost(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
        }
    }

    // Helper class to hold product and quantity in cart
    public static class CartItem {
        public Products product;
        public int quantity;

        public CartItem(Products product, int quantity) {
            this.product = product;
            this.quantity = quantity;
        }
    }
}
