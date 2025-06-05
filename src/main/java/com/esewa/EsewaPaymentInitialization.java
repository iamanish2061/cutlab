package com.esewa;

import java.io.IOException;
import java.io.PrintWriter;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/sendFormToEsewa")
public class EsewaPaymentInitialization extends HttpServlet{
	private static final long serialVersionUID = 1L;
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
		EsewaAttributes esewa=(EsewaAttributes)request.getAttribute("EsewaInfo");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        out.println("<html><body>");
        out.println("<form id='esewaForm' action='"+EsewaAttributes.PAYMENT_URL+"' method='POST'>");
        out.println("<input type='hidden' id='amount' name='amount' value='" + esewa.getAmount() + "' required />");
        out.println("<input type='hidden' id='tax_amount' name='tax_amount' value='"+ esewa.getTaxAmt() +"' required />");
        out.println("<input type='hidden' id='total_amount' name='total_amount' value='"+ esewa.getTotal_amount() +"' required />");
        out.println("<input type='hidden' id='transaction_uuid' name='transaction_uuid' value='"+ esewa.getTransaction_uuid() +"' required />");
        out.println("<input type='hidden' id='product_code' name='product_code' value='"+ EsewaAttributes.MERCHANT_ID +"' required />");
        out.println("<input type='hidden' id='product_service_charge' name='product_service_charge' value='"+ esewa.getProductServiceCharge() +"' required />");
        out.println("<input type='hidden' id='product_delivery_charge' name='product_delivery_charge' value='"+ esewa.getProductDeliveryCharge() +"' required />");
        out.println("<input type='hidden' id='success_url' name='success_url' value='"+ EsewaAttributes.SUCCESS_URL +"' required />");
        out.println("<input type='hidden' id='failure_url' name='failure_url' value='"+ EsewaAttributes.FAIL_URL +"' required />");
        out.println("<input type='hidden' id='signed_field_names' name='signed_field_names' value='total_amount,transaction_uuid,product_code' required />");
        out.println("<input type='hidden' id='signature' name='signature' value='"+ esewa.getSignature() +"' required />");
        out.println("<input value='Submit' type='submit' id='submit-btn'>");
        out.println("</form>");
        out.println("<script>");
        out.println("document.getElementById('submit-btn').style.display = 'none';");
        out.println("document.getElementById('esewaForm').submit();");
        out.println("</script>");
        out.println("</body></html>");

	}
	
}

