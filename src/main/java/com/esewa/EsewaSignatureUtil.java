package com.esewa;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.tomcat.util.codec.binary.Base64;

import jakarta.servlet.http.HttpServlet;

@SuppressWarnings("deprecation")
public class EsewaSignatureUtil extends HttpServlet{
    
	private static final long serialVersionUID = 1L;
	
	public static String generateTransactionUuid(String ids, String qtys, String amount) {        
        String uniqueSeed = String.join("|",
                ids,
                qtys,
                amount,
                String.valueOf(Instant.now().toEpochMilli()),
                String.valueOf(new SecureRandom().nextInt(1000))
            );
      return UUID.nameUUIDFromBytes(uniqueSeed.getBytes(StandardCharsets.UTF_8)).toString();
    }
	
	public static String prepareData(String totalAmount, String transactionUuid, String productCode) {
    	String data= String.format("total_amount=%s,transaction_uuid=%s,product_code=%s",totalAmount, transactionUuid, productCode);
    	return data;
    }
	
	public static String getSignature(String data) {
		String signature="";
		try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                EsewaAttributes.SECRET_KEY.getBytes(StandardCharsets.UTF_8), "HmacSHA256"
            );
            sha256_HMAC.init(secretKeySpec);
            
            byte[] hashBytes = sha256_HMAC.doFinal(
                data.getBytes(StandardCharsets.UTF_8)
            );
            signature = Base64.encodeBase64String(hashBytes);
            System.out.println("Signature: " + signature);
        } catch (Exception e) {
            e.printStackTrace();
        }
		return signature;
	}
	
	//to verify signature sent from esewa
	public static boolean verifySignature(EsewaAttributes response) {
	    try {
	        String[] fields = response.getSigned_field_names().split(",");
	        
	        StringBuilder signedData = new StringBuilder();

	        for (int i = 0; i < fields.length; i++) {
	            String key = fields[i];
	            String value = getValueFromResponse(response, key); 
	            signedData.append(key).append("=").append(value);
	            if (i < fields.length - 1) signedData.append(",");
	        }

	        String esewaGeneratedSignature = getSignature(signedData.toString());
	        
	        return (response.getSignature().equals(esewaGeneratedSignature));
	    } catch (Exception e) {
	        e.printStackTrace();
	        return false;
	    }
	}
	
	public static String getValueFromResponse(EsewaAttributes response, String fieldName) {
	    switch (fieldName) {
	        case "transaction_code": return response.getTransaction_code();
	        case "status": return response.getStatus();
	        case "total_amount": return response.getTotal_amount();
	        case "transaction_uuid": return response.getTransaction_uuid();
	        case "product_code": return response.getProduct_code();
	        case "signed_field_names": return response.getSigned_field_names();
	        default: return ""; // Add more if eSewa returns additional fields
	    }
	}
    
    
    
    
    
    
    
}