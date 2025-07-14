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

@WebServlet("/payment-failure")
public class PaymentFailureServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	Database db;
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		db= new Database();
		super.init(config);
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(req, resp);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
		EsewaAttributes fail = null;
		Object attribute = request.getAttribute("paymentDetailsF");
		
		if(attribute == null){
			//tala ko 1 description
			response.sendRedirect("failure.html?error=You cancelled the payment process!");
		}else if (attribute instanceof EsewaAttributes) {
		    fail = (EsewaAttributes) attribute;
		    
		    try {
				if(db.changeOrderStatus(fail.getTransaction_uuid(), "HOLD")) { //desc 2
					if(db.cutToOrderItems(fail.getTransaction_uuid()) && db.insertIntoPayment(fail, "esewa")){
						response.sendRedirect("failure.html?error=Payment not handled from Esewa!");				
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
                
    }
}


//1
//user le cancel garyo vane
//order ko status pending mai adkiyo vane user le bich bata kateko huna parxa
//so admin side bata tyo order id ko shipping and order details hataidiney


//2
//order ko status hold (admin bata milauney {
//payment aayena vane order, shipping, order items and payment hatauney
// payment aayo vane order status delivery gardiney and payment maa status complete gardiney
//})


