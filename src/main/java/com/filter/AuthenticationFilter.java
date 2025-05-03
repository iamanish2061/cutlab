package com.filter;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebFilter(urlPatterns = {"/welcome.html", "/cart.html", "/checkout.html"})
public class AuthenticationFilter implements Filter {

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		
		HttpServletRequest request = (HttpServletRequest)req;
		HttpServletResponse response = (HttpServletResponse)res;
		
		HttpSession s= request.getSession(false);
		
		if(s != null && s.getAttribute("loginStatus") != null && s.getAttribute("user_id") != null) {
				chain.doFilter(request, response);			
		}else {
			response.sendRedirect("login.html");
		}			
		
	}

}
