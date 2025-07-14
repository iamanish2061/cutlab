package com.cutlab;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;

import javax.imageio.ImageIO;

import com.dao.Database;
import com.dao.Utility;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.Part;

@WebServlet("/UploadPhoto")
@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 2, // 2MB
                 maxFileSize = 1024 * 1024 * 10,      // 10MB
                 maxRequestSize = 1024 * 1024 * 50)   // 50MB

public class ImageUploadServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private static final String UPLOAD_DIR = "images/user_profile";
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        Database db = new Database();
    	HashMap<String, Object> jsonResponse = new HashMap<>();
		HttpSession session = request.getSession(false);		
		if(session == null || !session.getAttribute("loginStatus").equals(true) || session.getAttribute("user_id") == null) {
			jsonResponse.put("status", "fail");
            jsonResponse.put("message", "User not logged in");
            Utility.sendJsonResponse(response, jsonResponse);
            return;
		}else if(session.getAttribute("name") == null) {
			jsonResponse.put("status", "fail");
            jsonResponse.put("message", "Please fill the details first!");
            Utility.sendJsonResponse(response, jsonResponse);
            return;
		}
		
		int userId = Integer.parseInt(session.getAttribute("user_id").toString());
		String user_name = (String)session.getAttribute("name");
    	
        try {
            // Get the image part
        	Part filePart = request.getPart("profileImage");
            String fileName = user_name+userId+ ".jpg";
            
            String tmpUploadPath = getServletContext().getRealPath("/")+ UPLOAD_DIR;
            String perUploadPath = "D:/projectWorkspace/cutlab/src/main/webapp/"+ UPLOAD_DIR;
            
         // Create directory if it doesn't exist
            File uploadTempDir = new File(tmpUploadPath);
            if (!uploadTempDir.exists()) {
            	uploadTempDir.mkdirs();
            }
            
            File uploadPermanentDir = new File(perUploadPath);
            if (!uploadPermanentDir.exists()) {
            	uploadPermanentDir.mkdirs();
            }
            
            String tmpFilePath = tmpUploadPath + File.separator + fileName;
            String permanentFilePath = perUploadPath + File.separator + fileName;
            
            File oldTmpFile = new File(tmpFilePath);
            if (oldTmpFile.exists()) {
            	oldTmpFile.delete();
            }
            File oldPerFile = new File(permanentFilePath);
            if (oldPerFile.exists()) {
            	oldPerFile.delete();
            }
            
            // Process the image
            InputStream fileContent = filePart.getInputStream();
            BufferedImage originalImage = ImageIO.read(fileContent);
            
            if (originalImage == null) {
                throw new IOException("Invalid image file");
            }
            
            // Convert to JPG if needed (handles PNG->JPG conversion)
            BufferedImage jpgImage = new BufferedImage(
                originalImage.getWidth(),
                originalImage.getHeight(),
                BufferedImage.TYPE_INT_RGB);
            
            jpgImage.createGraphics().drawImage(originalImage, 0, 0, null);
            
            // Save as JPG
            ImageIO.write(jpgImage, "jpg", new File(tmpFilePath));
            ImageIO.write(jpgImage, "jpg", new File(permanentFilePath));
            
            // Send JSON response
            if(db.changePicturePath(userId, fileName)) {
            	jsonResponse.put("status", "success");
                jsonResponse.put("profileUrl", fileName);
                Utility.sendJsonResponse(response, jsonResponse);
                return;
            }else {
            	throw new Exception("Failed to update database!");
            }    
            
        } catch (Exception e) {
        	jsonResponse.put("status", "fail");
            jsonResponse.put("message", e.getMessage());
            Utility.sendJsonResponse(response, jsonResponse);
            return;
        }
    }
}