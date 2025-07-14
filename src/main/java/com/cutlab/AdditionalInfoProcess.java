package com.cutlab;

import java.io.IOException;
import java.sql.SQLException;

import com.dao.Database;
import com.dao.User;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/AdditionalSignupProcess")
public class AdditionalInfoProcess extends HttpServlet{
	private static final long serialVersionUID = 1L;
	Database db;
	
		
	@Override
	public void init(ServletConfig config) throws ServletException {
		// TODO Auto-generated method stub
		db = new Database();
	}

	@Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doPost(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    	HttpSession session = request.getSession(false);
		int userId = Integer.parseInt(session.getAttribute("user_id").toString());
		
		String fname = request.getParameter("firstName").trim();
		String lname = request.getParameter("lastName").trim();
		String gender = request.getParameter("gender").trim();
		String dob = request.getParameter("dob").trim();
        String address = request.getParameter("address").trim();
        String phone = request.getParameter("phone").trim();
        String source = request.getParameter("source").trim();
        
        User u = new User();
        u.setFirstName(fname);
        u.setLastName(lname);
        u.setGender(gender);
        u.setDob(dob);
        u.setAddress(address);
        u.setPhoneNumber(phone);
        
        try {
			boolean result = db.insertAdditionalInfo(u, userId);
			if(result) {
				session.setAttribute("name", fname);
				response.sendRedirect("/cutlab/"+source); 
			}else {
				response.sendRedirect("/cutlab/signupAdditional.html?error=Failed to store your data! Please try again after few seconds!!");
			}
		} catch (ClassNotFoundException | SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
           
    }

}