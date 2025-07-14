package com.cutlab;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import com.dao.Database;
import com.dao.Utility;

import jakarta.mail.AuthenticationFailedException;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.SendFailedException;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;


@WebServlet("/SendEmail")
public class SendEmail extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // SMTP Server Configuration (Gmail example)
    private static final String SMTP_HOST = "smtp.gmail.com";
    private static final String SMTP_PORT = "587";
    private static final String USERNAME = "anishpersonalanne@gmail.com";
    private static final String PASSWORD = "wrst ojgq xevw ncqd"; // Store password in environment variable

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Map<String, Object> jsonResponse = new HashMap<>();
    	
        String email = request.getParameter("email").trim();
        String flag = request.getParameter("flag").trim();
        
    	Database db = new Database();
    	try {
			if(db.checkIfEmailAlreadyExists(email) && flag.equalsIgnoreCase("CreateAccount")) {
				jsonResponse.put("status", "fail");
	        	jsonResponse.put("message", "Email Already Exist!");
	        	Utility.sendJsonResponse(response, jsonResponse);
	        	return;
			}else if( !(db.checkIfEmailAlreadyExists(email)) && flag.equalsIgnoreCase("ResetPassword")) {
				jsonResponse.put("status", "fail");
	        	jsonResponse.put("message", "Email not found!");
	        	Utility.sendJsonResponse(response, jsonResponse);
	        	return;
			}else {
				Integer code = (int)(Math.random() * 9000) + 1000;
		        System.out.println("Generated verification code: " + code);

		        boolean emailSent = sendVerificationEmail(email, code, flag);

		        if (emailSent) {
		        	HttpSession oldSession = request.getSession(false);
	                if (oldSession != null) {
	                    oldSession.invalidate();
	                }
	                HttpSession newSession = request.getSession(true);
		        	newSession.setAttribute("verificationCode", code.toString());
		        	newSession.setAttribute("verificationEmail", email);
		        	
		        	jsonResponse.put("status", "success");
		        	jsonResponse.put("message", "Verification code sent!");
		        	Utility.sendJsonResponse(response, jsonResponse);
		        	return;
		        } else {
		            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to send verification email");
		        }
			}
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
			jsonResponse.put("status", "error");
        	jsonResponse.put("message", "Server error, please try again later.");
        	Utility.sendJsonResponse(response, jsonResponse);
		} 
    	
        
    }

    private boolean sendVerificationEmail(String email, int code, String type) {
    	boolean flag=false;
    	try {
            String to = email;
            String subject="";
            if(type.equalsIgnoreCase("CreateAccount")) {
            	subject = "Confirmation Email for Creating Account";
            }else if(type.equalsIgnoreCase("ResetPassword")){
            	subject = "Confirmation Email to Reset Account's Password";
            }else {
            	subject = "Confirmation Mail";
            }
            
            String body = "This email was sent for confirmation! Your code is: " + code + " . Please do not share it with others.";

            // 1. Setup SMTP properties
            Properties props = new Properties();
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true"); // TLS encryption
            props.put("mail.smtp.host", SMTP_HOST);
            props.put("mail.smtp.port", SMTP_PORT);
            props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
			
        // 2. Create authenticator
            Authenticator auth = new jakarta.mail.Authenticator() {
            	@Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(USERNAME, PASSWORD);
                }
            };
            // 3. Create session
            Session session = Session.getInstance(props, auth);

            // 4. Create message
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(USERNAME));
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
            message.setSubject(subject);
            message.setText(body); // Plain text email

            // 5. Send email
            Transport.send(message);
            flag=true;
            
            System.out.println("Email sent successfully!");
            return flag;

        } catch (AuthenticationFailedException e) {
            System.err.println("Authentication failed - check credentials.");
            e.printStackTrace();
        } catch (SendFailedException e) {
            System.err.println("Invalid recipient address.");
            e.printStackTrace();
        } catch (MessagingException e) {
            System.err.println("MessagingException occurred while sending the email:");
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("Unexpected error occurred:");
            e.printStackTrace();
        }
        return flag;
    }
    
   
}

