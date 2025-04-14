package com.cutlab;

import java.io.IOException;
import java.sql.SQLException;

import com.dao.Database;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.net.URLEncoder;


@WebServlet("/LoginProcess")
public class LoginProcess extends HttpServlet {
	private static final long serialVersionUID = 1L;
       

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("login-email");
        String password = request.getParameter("login-password");
        Database db= new Database();
//        RequestDispatcher rd = request.getRequestDispatcher("login.html");
//        request.setAttribute("email", email);
        try {
			if (db.checkIfEmailAlreadyExists(email)) {
				if(db.doesEmailAndPasswordMatch(email, password)) {
					// Creating new session (invalidating old one first for security)
	                HttpSession oldSession = request.getSession(false);
	                if (oldSession != null) {
	                    oldSession.invalidate();
	                }
	                HttpSession newSession = request.getSession(true);
	                newSession.setAttribute("loginStatus", true);
	                newSession.setAttribute("fname", db.returnName(email));
	                
	                if(db.returnId(email) > 0) {
	                	newSession.setAttribute("user_id", db.returnId(email));
	                }else {
	                	newSession.setAttribute("user_id", "Not Found");
	                }
	                newSession.setMaxInactiveInterval(60 * 60); //session timeout (1 hour)
	                response.sendRedirect("welcome.html"); // Redirect if login is successful
				}else {
//					request.setAttribute("errorMsg", "Email and Password does not match.");
//			        rd.forward(request, response);
					
					response.sendRedirect("login.html?error=" + URLEncoder.encode("password", "UTF-8"));
//					response.sendRedirect("login.html?error=password");
				}
			} else {
//				request.setAttribute("errorMsg", "Invalid credentials.");
//			    rd.forward(request, response);
				response.sendRedirect("login.html?error="+ URLEncoder.encode("invalidEmail", "UTF-8"));
			}
		} catch (ClassNotFoundException | SQLException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }

}
