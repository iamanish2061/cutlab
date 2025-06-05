package com.filter;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import com.dao.Utility;
import com.dao.Validation;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;


@WebFilter(urlPatterns = {"/beforeCheckout", "/checkout"})
public class ValidationOfCheckOut implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        HashMap<String, Object> jsonResponse = new HashMap<>();
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Handle POST /beforeCheckout
        if (path.endsWith("/beforeCheckout") && "POST".equalsIgnoreCase(method)) {
        	//session for user id
    		HttpSession session = request.getSession(false);
            if (session == null || !session.getAttribute("loginStatus").equals(true)) {
                jsonResponse.put("status", "fail");
                jsonResponse.put("message", "User not logged in");
                Utility.sendJsonResponse(response, jsonResponse);
                return;
            }
            
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            try {
                Gson gson = new Gson();
                Map<Integer, Integer> cartData = gson.fromJson(
                    sb.toString(),
                    new TypeToken<Map<Integer, Integer>>() {}.getType()
                );

                if (cartData == null || cartData.isEmpty()) {
                    jsonResponse.put("status", "fail");
                    jsonResponse.put("message", "No product in cart!");
                    Utility.sendJsonResponse(response, jsonResponse);
                    return;
                }

                for (Map.Entry<Integer, Integer> entry : cartData.entrySet()) {
                    if (entry.getKey() <= 0 || entry.getValue() <= 0) {
                        jsonResponse.put("status", "fail");
                        jsonResponse.put("message", "Invalid product id or quantity!");
                        Utility.sendJsonResponse(response, jsonResponse);
                        return;
                    }
                }

                request.setAttribute("validatedCartData", cartData);
                chain.doFilter(request, response);
                return;
            } catch (JsonSyntaxException e) {
                jsonResponse.put("status", "fail");
                jsonResponse.put("message", "Invalid JSON format!");
                Utility.sendJsonResponse(response, jsonResponse);
                return;
            }
        }

        // Handle GET /checkout?action=gettotalamount
        if (path.endsWith("/checkout") && "GET".equalsIgnoreCase(method)) {
        	//session for user id
    		HttpSession session = request.getSession(false);
            if (session == null || !session.getAttribute("loginStatus").equals(true)) {
                jsonResponse.put("status", "fail");
                jsonResponse.put("message", "User not logged in");
                Utility.sendJsonResponse(response, jsonResponse);
                return;
            }
            
            String action = request.getParameter("action");
            if (action != null && !action.isEmpty()) {
                if (!"gettotalamount".equalsIgnoreCase(action)) {
                    jsonResponse.put("status", "fail");
                    jsonResponse.put("message", "Invalid attempt!");
                    Utility.sendJsonResponse(response, jsonResponse);
                    return;
                }
            }

            chain.doFilter(request, response);
            return;
        }
        
        
        
        if (path.endsWith("/checkout") && "POST".equalsIgnoreCase(method)) {                   	
            final String[] fieldNames = {"fullname", "address", "city", "state", "zip", "phone", "email", "pay_method"};
            
            Map<String, String> formData = new HashMap<>();
            for (String field : fieldNames) {
                formData.put(field, req.getParameter(field));
            }

            String error = "";
            for (String field : fieldNames) {
                String value = formData.get(field);
                error = validateField(field, value.trim());
                if (!error.isEmpty()) break; // fail-fast on first error
                System.out.println("valid");
            }

            if (!error.isEmpty()) {
                StringBuilder redirectUrl = new StringBuilder("/cutlab/checkout.html?error=")
                    .append(URLEncoder.encode(error, "UTF-8"));
                for (Map.Entry<String, String> entry : formData.entrySet()) {
                    redirectUrl.append("&").append(entry.getKey()).append("=")
                        .append(URLEncoder.encode(entry.getValue(), "UTF-8"));
                }
                response.sendRedirect(redirectUrl.toString());
                return;
            }
            
            chain.doFilter(request, response);
            return;
        }


        
        
        chain.doFilter(request, response);
    }
    
    // Dispatcher function
    private String validateField(String fieldName, String value) {
        switch (fieldName) {
            case "fullname":
                return Validation.validateFullName(value);
            case "address":
                return Validation.validateAddress(value);
            case "city":
                return Validation.validateCity(value);
            case "state":
                return Validation.validateState(value);
            case "zip":
                return Validation.validateZip(value);
            case "phone":
                return Validation.validatePhone(value);
            case "email":
                return Validation.validateEmail(value);
            case "pay_method":
            	return Validation.validatePayMethod(value);
            default:
                return "";
        }
    }

}

