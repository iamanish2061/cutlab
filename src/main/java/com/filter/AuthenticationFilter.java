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

@WebFilter(urlPatterns = {"/logout.html", "/signupAdditional.html", "/profile.html", "/checkout.html", "/AddCart.html"})
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

//profile maa chai signupadditional ni huna parxa 
//signup add garesi name session maa rakhesi balla valid hunxa ani profile maa laney navaye 
//loggedin status xaina vane login.html maa redirect
// name ko lagi signupAdditional maa redirect
//check out maa jada cart maa huna parxa
