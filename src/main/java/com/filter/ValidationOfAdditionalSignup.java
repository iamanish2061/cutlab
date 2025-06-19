package com.filter;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import com.dao.Utility;
import com.dao.Validation;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebFilter(urlPatterns = {"/AdditionalSignupProcess"})

public class ValidationOfAdditionalSignup implements Filter {
	    @Override
	    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
	            throws IOException, ServletException {
	   
	        HttpServletRequest request = (HttpServletRequest) req;
	        HttpServletResponse response = (HttpServletResponse) res;
	        String path = request.getRequestURI();
	        String method = request.getMethod();

	        if (path.endsWith("/AdditionalSignupProcess") && "POST".equalsIgnoreCase(method)) {    
	        	
	        	HttpSession session = request.getSession(false);
	            if (session == null || !session.getAttribute("loginStatus").equals(true)) {
	            	response.sendRedirect("login.html");
	                return;
	            }
	        	
	            final String[] fieldNames = {"firstName", "lastName", "gender", "dob", "address", "phone"};
	            
	            Map<String, String> formData = new HashMap<>();
	            for (String field : fieldNames) {
	                formData.put(field, req.getParameter(field).trim());
	            }

	            String error = "";
	            for (String field : fieldNames) {
	                String value = formData.get(field);
	                error = validateField(field, value.trim());
	                System.out.println("error: " +error);
	                if (!error.isEmpty()) break; // fail-fast on first error
	                System.out.println("valid");
	            }

	            if (!error.isEmpty()) {
	                StringBuilder redirectUrl = new StringBuilder("/cutlab/signupAdditional.html?error=")
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
	            case "firstName":
	            case "lastName":
	            	return Validation.validateNameField(fieldName, value);
	            case "gender":
	            	return Validation.validateGender(value);
	            case "dob":
	            	return Validation.validateDob(value);
	            case "address":
	                return Validation.validateAddress(value);
	            case "phone":
	                return Validation.validatePhone(value);
	            default:
	                return "";
	        }
	    }

	}
	
	

