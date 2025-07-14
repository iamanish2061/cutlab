package com.cutlab;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import com.dao.Database;
import com.dao.ShippingDetails;
import com.dao.Utility;
import com.esewa.EsewaAttributes;
import com.esewa.EsewaSignatureUtil;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/checkout")
public class Checkout extends HttpServlet{
	private static final long serialVersionUID = 1L;
	private Database db;
		
	@Override
	public void init(ServletConfig config) throws ServletException {
		db = new Database();
	}
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession(false);
		int userId = Integer.parseInt(session.getAttribute("user_id").toString());
		
		Map<String, Object> jsonResponse = new HashMap<>();

		String action = request.getParameter("action");
		if(!action.equalsIgnoreCase("gettotalamount")) {
			jsonResponse.put("status", "fail");
			jsonResponse.put("message", "Invalid Attempt!");
			Utility.sendJsonResponse(response, jsonResponse);
			return;
		}
		
		float subTotal = db.getTotalAmountOfCart(userId);
		
		if(subTotal <= 0.0) {
			jsonResponse.put("status", "fail");
			jsonResponse.put("message", "Nothing in Cart. Please add products to cart!");
			Utility.sendJsonResponse(response, jsonResponse);
			return;
		}else {
			jsonResponse.put("status", "success");
			jsonResponse.put("subtotal", subTotal);
			jsonResponse.put("total", subTotal+100.00);
			Utility.sendJsonResponse(response, jsonResponse);
			return;
		}
		
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		HttpSession session = request.getSession(false);
		int userId = Integer.parseInt(session.getAttribute("user_id").toString());
				
		float subTotal = db.getTotalAmountOfCart(userId);
		
		if(subTotal <= 0.0) {
			response.sendRedirect("/cutlab/checkout.html?error=Please add to cart first!");
			return;
		}else {
			String fullname = request.getParameter("fullname");
	        String address = request.getParameter("address");
	        String city = request.getParameter("city");
	        String state = request.getParameter("state");
	        String zip = request.getParameter("zip");
	        String phone = request.getParameter("phone");
	        String email = request.getParameter("email");
	        String payMethod = request.getParameter("pay_method");
	        
	        ShippingDetails sd = new ShippingDetails(fullname, address, city, state, zip, phone, email);

	        RequestDispatcher dispatcher;
	        if(payMethod.equalsIgnoreCase("esewa")) {
	        	EsewaAttributes esewa = new EsewaAttributes();
	        	esewa.setAmount(subTotal);
				esewa.setTaxAmt(0);
				esewa.setProductServiceCharge(0);
				esewa.setProductDeliveryCharge(100);
				
				String total = Float.toString(subTotal+esewa.getProductDeliveryCharge());
				esewa.setTotal_amount(total);
				
				String transactionUuid = EsewaSignatureUtil.generateTransactionUuid("1", "1", total);
				esewa.setTransaction_uuid(transactionUuid);
				
				String data = EsewaSignatureUtil.prepareData(total, transactionUuid, EsewaAttributes.MERCHANT_ID);
				String signature = EsewaSignatureUtil.getSignature(data);
				esewa.setSignature(signature);
				
				//inserting into orders and shipping table
				try {
					if(db.insertIntoOrders(userId, transactionUuid, esewa)) {
						if(db.insertIntoShippingDetails(sd, transactionUuid)) {
							request.setAttribute("EsewaInfo", esewa);
							dispatcher = request.getRequestDispatcher("/sendFormToEsewa");
							dispatcher.forward(request, response);
						}else {
							response.sendRedirect("/checkout.html?error=Failed to store shipping details, Please try again later!");
						}
					}else {
						response.sendRedirect("/checkout.html?error=Failed to store order, Please try again later!");
					}
				} catch (ClassNotFoundException | SQLException | ServletException | IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
								
	        }else if(payMethod.equalsIgnoreCase("khalti")) {
	        	
	        	//same as esewa 
	        	
	        	dispatcher = request.getRequestDispatcher("/sendFormToKhalti");
				dispatcher.forward(request, response);
	        }else if(payMethod.equalsIgnoreCase("cod")){
	        	//logic left to draw
	        }else {
	        	response.sendRedirect("/checkout.html?error=Please select payment method!");
	        }   
		}	
	}	
}

//shipping and order halna baki khalti ko
//cod ko logic baki

