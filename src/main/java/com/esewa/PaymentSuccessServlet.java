package com.esewa;

import java.io.IOException;
import java.sql.SQLException;

import com.dao.Database;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/payment-success")
public class PaymentSuccessServlet extends HttpServlet {
	Database db;
	private static final long serialVersionUID = 1L;

	@Override
	public void init(ServletConfig config) throws ServletException {
		// TODO Auto-generated method stub
		db = new Database();
		super.init(config);
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        doPost(request, response);
       
    }
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
		
		EsewaAttributes successResponse = null;
		Object attribute = request.getAttribute("paymentDetails");
		
		if(attribute == null){
			response.sendRedirect("/checkout.html?error=paymentDetails Invalid!");
		}else if (attribute instanceof EsewaAttributes) {
			successResponse = (EsewaAttributes) attribute;
			try {
				if(db.changeOrderStatus(successResponse.getTransaction_uuid(), "DELIVERY")) {
					if(db.cutToOrderItems(successResponse.getTransaction_uuid()) && db.insertIntoPayment(successResponse, "esewa")){
						response.sendRedirect("success.html");				
					}else {
						response.sendRedirect("/checkout.html?error=Unable to insert into order-items and payment!");
					}
				}else {
					response.sendRedirect("/checkout.html?error=Unable to change Status!");
				}
			} catch (ClassNotFoundException | SQLException | IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		//check garna baki ekchoti run garera
		//email pathauney ni xa
       
    }
}
