package com.dao;

import java.sql.Connection;
//import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Base64;

public class Database {
	
	public Connection dbConnectionObject() throws ClassNotFoundException, SQLException {
		 Class.forName("com.mysql.cj.jdbc.Driver");
	     System.out.println("Driver loaded");
	 
	     // Establish a connection
	     Connection connection = DriverManager.getConnection("jdbc:mysql://root:anish2061@localhost:3306/ecommerce");
	     System.out.println("Database connected");
	     
	     return connection;
	     	
	 }
	
	public boolean insertSignupData(User user) throws ClassNotFoundException, SQLException {
		
		Connection conn = dbConnectionObject();
		String query = "insert into users(email, password, salt) values(?,?,?)";
		PreparedStatement preparedStatement = conn.prepareStatement(query);
		preparedStatement.setString(1, user.getEmail());
		preparedStatement.setString(2, user.getPassword());
		preparedStatement.setString(3, user.getSalt());
		
		int status=preparedStatement.executeUpdate();
		conn.close();
		
		if(status !=0) {
			return true;
		}else {
			return false;
		}
	}
	
	public boolean checkIfEmailAlreadyExists(String email) throws SQLException, ClassNotFoundException {
        String query = "SELECT COUNT(*) AS totalEmail FROM users WHERE email = ?";

        try (Connection conn = dbConnectionObject();
             PreparedStatement preparedStatement = conn.prepareStatement(query)) {
            
            preparedStatement.setString(1, email);
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                if (resultSet.next()) {
                    int count = resultSet.getInt("totalEmail");
                    conn.close();
                    return count > 0; // If count > 0, email exists
                }
            }
        }
        
        return false; // Default return if no email is found
    }
	
	public boolean checkIfNumberAlreadyExists(String num) throws SQLException, ClassNotFoundException {
        String query = "SELECT COUNT(*) AS totalNum FROM users WHERE phoneNumber = ?";

        try (Connection conn = dbConnectionObject();
             PreparedStatement preparedStatement = conn.prepareStatement(query)) {
            
            preparedStatement.setString(1, num);
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                if (resultSet.next()) {
                    int count = resultSet.getInt("totalNum");
                    conn.close();
                    return count > 0; // If count > 0, number exists
                }
            }
        }
        return false; // Default return if no number is found
    }
	
	public boolean doesEmailAndPasswordMatch(String email, String password) throws SQLException, ClassNotFoundException {
        String query = "SELECT password, salt FROM users WHERE email = ?";

        try (Connection conn = dbConnectionObject();
             PreparedStatement preparedStatement = conn.prepareStatement(query)) {
            
            preparedStatement.setString(1, email);
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                if (resultSet.next()) {
                	
                	String dbHashedPassword= resultSet.getString("password");
                	String dbSalt = resultSet.getString("salt");
                	// Convert salt back to byte array
                	byte[] saltBytes = Base64.getDecoder().decode(dbSalt);
                	
                	// Hash the entered password using the stored salt
	                String enteredHashedPassword = User.hashPassword(password, saltBytes);

	                // Compare stored hash with the new hash
	                conn.close();
	                return dbHashedPassword.equals(enteredHashedPassword);
                	
                }
            }
        }
		return false;
    }
	
//	public String returnName(String email) {
//		String fname="";
//		String query = "SELECT fname as name FROM users WHERE email = ?";
//
//        try (Connection conn = dbConnectionObject();
//             PreparedStatement preparedStatement = conn.prepareStatement(query)) {
//            
//            preparedStatement.setString(1, email);
//            try (ResultSet resultSet = preparedStatement.executeQuery()) {
//                if (resultSet.next()) {
//                	fname= resultSet.getString("name");	 
//                	conn.close();
//	                return fname;
//                }
//            }
//        } catch (ClassNotFoundException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (SQLException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		
//		return fname;
//	}

	public int returnId(String email) {
		int id;
		String query = "SELECT user_id as id FROM users WHERE email = ?";

        try (Connection conn = dbConnectionObject();
             PreparedStatement preparedStatement = conn.prepareStatement(query)) {
            
            preparedStatement.setString(1, email);
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                if (resultSet.next()) {
                	id= resultSet.getInt("id");	   
                	conn.close();
	                return id;
                }
            }
        } catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return -1;
	}
	
	// forget password and changing password
	public boolean updatePassword(User user) throws ClassNotFoundException, SQLException { 
		Connection conn = dbConnectionObject();
		String query = "update users set password=?, salt=? where email=?";
		PreparedStatement preparedStatement = conn.prepareStatement(query);
		preparedStatement.setString(1, user.getPassword());
		preparedStatement.setString(2, user.getSalt());
		preparedStatement.setString(3, user.getEmail());
		
		int status=preparedStatement.executeUpdate();
		conn.close();
		
		if(status !=0) {
			return true;
		}else {
			return false;
		}
	}
}
