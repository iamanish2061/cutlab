package com.esewa;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/payment-failure")
public class PaymentFailureServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(req, resp);
	}



	protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Get failure reason
        String errorCode = request.getParameter("error_code");
        String errorMessage = request.getParameter("error_message");
        
        request.setAttribute("errorCode", errorCode);
        request.setAttribute("errorMessage", errorMessage);
        System.out.println("failed");
//        request.getRequestDispatcher("/failure.jsp").forward(request, response);
    }
}
