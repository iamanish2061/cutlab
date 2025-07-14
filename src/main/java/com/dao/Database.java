package com.dao;

import java.sql.Connection;
//import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.esewa.EsewaAttributes;

public class Database {
	
	public Connection dbConnectionObject() throws ClassNotFoundException, SQLException {
		 Class.forName("com.mysql.cj.jdbc.Driver");
	 
	     // Establish a connection
	     Connection connection = DriverManager.getConnection("jdbc:mysql://root:anish2061@localhost:3306/ecommerce");
	     
	     return connection;
	     	
	 }
	
	public boolean insertSignupData(User user) throws ClassNotFoundException, SQLException {
		
		String query = "insert into users(email, password, salt) values(?,?,?)";
		try(Connection conn = dbConnectionObject();
		PreparedStatement preparedStatement = conn.prepareStatement(query)){
			preparedStatement.setString(1, user.getEmail());
			preparedStatement.setString(2, user.getPassword());
			preparedStatement.setString(3, user.getSalt());
			
			int affectedRows=preparedStatement.executeUpdate();
			return affectedRows>0;
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
                    return count > 0; 
                }
            }
        }
        
        return false; // Default return if no email is found
    }

	public boolean checkIfNumberAlreadyExists(String num) throws SQLException, ClassNotFoundException {
	    String query = "SELECT 1 FROM users WHERE phoneNumber = ? LIMIT 1";
	    
	    try (Connection conn = dbConnectionObject();
	         PreparedStatement ps = conn.prepareStatement(query)) {
	        
	        ps.setString(1, num.trim());
	        
	        try (ResultSet rs = ps.executeQuery()) {
	            return rs.next(); // Returns true if a record exists
	        }
	    }
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
	                return dbHashedPassword.equals(enteredHashedPassword);
                	
                }
            }
        }
		return false;
    }
	
	public String returnName(String email) {
		String fname=null;
		String query = "SELECT fname as name FROM users WHERE email = ?";

        try (Connection conn = dbConnectionObject();
             PreparedStatement preparedStatement = conn.prepareStatement(query)) {
            
            preparedStatement.setString(1, email);
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                if (resultSet.next()) {
                	fname= resultSet.getString("name");	 
                }
            }
        } catch (ClassNotFoundException | SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		return fname;
	}

	public int returnId(String email) {
		int id = -1;
		String query = "SELECT user_id as id FROM users WHERE email = ?";

        try (Connection conn = dbConnectionObject();
             PreparedStatement preparedStatement = conn.prepareStatement(query)) {
            
            preparedStatement.setString(1, email);
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                if (resultSet.next()) {
                	id= resultSet.getInt("id");	   
                }
            }
        } catch (ClassNotFoundException | SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		
		return id;
	}
	
	// forget password and changing password
	public boolean updatePassword(User user) throws ClassNotFoundException, SQLException { 
		String query = "update users set password=?, salt=? where email=?";
		
		try(Connection conn = dbConnectionObject();
		PreparedStatement preparedStatement = conn.prepareStatement(query)){
			preparedStatement.setString(1, user.getPassword());
			preparedStatement.setString(2, user.getSalt());
			preparedStatement.setString(3, user.getEmail());
			
			int affectedRows=preparedStatement.executeUpdate();
			return affectedRows>0;
		}
				
	}
	
	
	//product page bata display garna ko lagi database query haru
	public List<Products> getAllProducts() throws SQLException, ClassNotFoundException {
        List<Products> products = new ArrayList<>();
        String query = "SELECT product_id, name, description, price,  image_url, stock_quantity  FROM products";
        
        try (Connection conn = dbConnectionObject();
             PreparedStatement ps = conn.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                Products product = new Products();
                product.setId(rs.getInt("product_id"));
                product.setName(rs.getString("name"));
                product.setDescription(rs.getString("description"));
                product.setPrice(rs.getDouble("price"));
                product.setUrl(rs.getString("image_url"));
                product.setStock(rs.getInt("stock_quantity"));
                
                products.add(product);
            }
        }
        return products;
    }
	
	public List<String> getCategories() throws SQLException, ClassNotFoundException {
        List<String> categories = new ArrayList<>();
        String query = "SELECT name FROM categories";
        
        try (Connection conn = dbConnectionObject();
             PreparedStatement ps = conn.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                categories.add(rs.getString("name"));
            }
        }
        return categories;
    }
	
	//category
	public List<Products> searchProductsAccordingCategory(String category) throws SQLException, ClassNotFoundException {
        List<Products> products = new ArrayList<>();
        String query = "SELECT p.product_id as id, p.name, p.description, p.price,  p.image_url, p.stock_quantity "
        		+ "FROM products p "
        		+ "JOIN categories c ON p.category_id = c.category_id "
        		+ " WHERE c.name = ?";

        try (Connection conn = dbConnectionObject();
            PreparedStatement ps = conn.prepareStatement(query)){
        		ps.setString(1, category);
        	
				try(ResultSet rs = ps.executeQuery()) {
	                while (rs.next()) {
	                	
	                	Products product = new Products();
	                    product.setId(rs.getInt("id"));
	                    product.setName(rs.getString("name"));
	                    product.setDescription(rs.getString("description"));
	                    product.setPrice(rs.getDouble("price"));
	                    product.setUrl(rs.getString("image_url"));
	                    product.setStock(rs.getInt("stock_quantity"));
	                    	                    
	                    products.add(product);
	                }
	            }
        }
        return products;
	}

	//search
	public List<Products> searchProducts(String search) throws SQLException, ClassNotFoundException {
        List<Products> products = new ArrayList<>();
        String[] keywords = search.split("\\s+"); // Split by spaces

        StringBuilder query = new StringBuilder("SELECT product_id as id, name, description, price,  image_url, stock_quantity  FROM products WHERE (");
        for (int i = 0; i < keywords.length; i++) {
            if (i > 0) query.append(" OR ");
            query.append("name LIKE ?");
        }
        query.append(")");

        try (Connection conn = dbConnectionObject();
            PreparedStatement ps = conn.prepareStatement(query.toString())){
	        	for (int i = 0; i < keywords.length; i++) {
	        	    ps.setString(i + 1, "%" + keywords[i] + "%");
	        	}

				try(ResultSet rs = ps.executeQuery()) {
	                while (rs.next()) {
	                	
	                	Products product = new Products();
	                    product.setId(rs.getInt("id"));
	                    product.setName(rs.getString("name"));
	                    product.setDescription(rs.getString("description"));
	                    product.setPrice(rs.getDouble("price"));
	                    product.setUrl(rs.getString("image_url"));
	                    product.setStock(rs.getInt("stock_quantity"));
	                    	                    
	                    products.add(product);
	                }
	            }
        	}
        return products;
	}
	
	//details about one product
	public Products getDetailsOfProduct(int productId) throws SQLException, ClassNotFoundException {
		
		String query= "SELECT p.product_id, p.name AS productName, p.description AS productDescription, p.price, p.image_url, p.stock_quantity, "
				+ "b.name as brandName, b.description as brandDescription, b.is_vegan, "
				+ "i.name AS ingredientName "
				+ "FROM products p "
				+ "JOIN brands b ON p.brand_id=b.brand_id "
				+ "JOIN product_ingredients pi ON p.product_id = pi.product_id "
				+ "JOIN ingredients i ON pi.ingredient_id = i.ingredient_id "
				+ "WHERE p.product_id = ?";
		
		Products product = null;
		Set<String> addedIngredients = new HashSet<>(); 

		try (Connection conn = dbConnectionObject();
	            PreparedStatement ps = conn.prepareStatement(query)){
	        		ps.setInt(1, productId);
	        	
					try(ResultSet rs = ps.executeQuery()) {
						while (rs.next()) {
						    if (product == null) {
						        product = new Products();
						        product.setId(rs.getInt("product_id"));
						        product.setName(rs.getString("productName"));
						        product.setDescription(rs.getString("productDescription"));
						        product.setPrice(rs.getDouble("price"));
						        product.setUrl(rs.getString("image_url"));
						        product.setStock(rs.getInt("stock_quantity"));

						        Brands brand = new Brands();
						        brand.setName(rs.getString("brandName"));
						        brand.setDescription(rs.getString("brandDescription"));
						        brand.setIs_vegan(rs.getBoolean("is_vegan"));
						        product.setBrand(brand);

						        product.setIngredients(new ArrayList<>());
						    }

						    String ingredientName = rs.getString("ingredientName");
						    if (ingredientName != null && !addedIngredients.contains(ingredientName)) {
						        product.getIngredients().add(ingredientName);
						        addedIngredients.add(ingredientName);
						    }
						}
		            }
	        }
		
		return product;
	}
	
// recommendations
    public List<Products> getRecommendedProducts(int productId) throws SQLException, ClassNotFoundException {
        List<Products> recommendations = new ArrayList<>();
        List <String> tags= new ArrayList<>();
        String query = "SELECT t.name FROM tags t "
        		+ "JOIN product_tags p ON t.tag_id=p.tag_id "
        		+ "WHERE p.product_id = ?";
        
        try (Connection conn = dbConnectionObject();
            PreparedStatement ps = conn.prepareStatement(query)) {
        	ps.setInt(1, productId);
            
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    tags.add(rs.getString("name"));                
                }
            }
        }
        if (tags.isEmpty()) return recommendations;
        
        String[] keywords = tags.toArray(new String[0]);

        StringBuilder recommendQuery = new StringBuilder("SELECT DISTINCT p.product_id as id, p.name, p.description, p.price,  p.image_url, p.stock_quantity  FROM products p "
        		+ "JOIN product_tags pt ON p.product_id=pt.product_id "
        		+ "JOIN tags t ON t.tag_id=pt.tag_id "
        		+ "WHERE (");
        for (int i = 0; i < keywords.length; i++) {
            if (i > 0) recommendQuery.append(" OR ");
            recommendQuery.append("t.name LIKE ?");
        }
        recommendQuery.append(") AND p.product_id != ?");


        try (Connection conn = dbConnectionObject();
            PreparedStatement ps = conn.prepareStatement(recommendQuery.toString())){
	        	for (int i = 0; i < keywords.length; i++) {
	        	    ps.setString(i + 1, "%" + keywords[i] + "%");
	        	}
	        	ps.setInt(keywords.length +1, productId);

				try(ResultSet rs = ps.executeQuery()) {
	                while (rs.next()) {
	                	Products product = new Products();
	                    product.setId(rs.getInt("id"));
	                    product.setName(rs.getString("name"));
	                    product.setDescription(rs.getString("description"));
	                    product.setPrice(rs.getDouble("price"));
	                    product.setUrl(rs.getString("image_url"));
	                    product.setStock(rs.getInt("stock_quantity"));
	                    	                    
	                    recommendations.add(product);
	                }
	            }
        	}
        return recommendations;
    }
    
    
    
    // cart ko db haru
//    add to cart ko add garda first time ho ki haina check garney
    public int checkQuantity(int p_id, int u_id) {
    	int qty =-1;
		String query = "SELECT quantity from cart WHERE product_id= ? AND user_id=?";

        try (Connection conn = dbConnectionObject();
             PreparedStatement preparedStatement = conn.prepareStatement(query)) {
            
            preparedStatement.setInt(1, p_id);
            preparedStatement.setInt(2, u_id);
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                if (resultSet.next()) {
                	qty= resultSet.getInt("quantity");	   
                }
            }
        } catch (ClassNotFoundException |SQLException e) {
			e.printStackTrace();
		} 
    	
    	return qty;
    }
    
    //inserting to cart for the new product
    public boolean insertIntoCart(int productId, int userId) throws SQLException, ClassNotFoundException{
		String query = "INSERT INTO cart(product_id, user_id, quantity) VALUES(?, ?, ?)";
		
		try(Connection conn = dbConnectionObject();
		PreparedStatement ps = conn.prepareStatement(query)){
			ps.setInt(1, productId);
			ps.setInt(2, userId);
			ps.setInt(3, 1);
			
			int affectedRows = ps.executeUpdate();
	        return affectedRows > 0;
		}
		
    }
    
 //before updating and deleting checking in cart if product exists
    public boolean checkIfProductExistInCart(int productId, int userId) {
        String query = "SELECT 1 FROM cart WHERE product_id = ? AND user_id = ? LIMIT 1";
        
        try (Connection conn = dbConnectionObject();
             PreparedStatement ps = conn.prepareStatement(query)) {
            
            ps.setInt(1, productId);
            ps.setInt(2, userId);
            
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next(); // Returns true if product exists in cart
            }
        } catch (ClassNotFoundException | SQLException e) {
            System.err.println("Error checking cart: " + e.getMessage());
            return false; // Default return on error
        }
    }
    
    //update garda ko
    public boolean updateCart(int productId, int userId, int qty) throws SQLException, ClassNotFoundException{
    	String query = "UPDATE cart SET quantity= ? WHERE product_id= ? AND user_id=?";

    	try(Connection conn = dbConnectionObject();
		PreparedStatement ps = conn.prepareStatement(query)){
    		ps.setInt(1, qty);
    		ps.setInt(2, productId);
    		ps.setInt(3, userId);
    		
    		int affectedRows = ps.executeUpdate();
            return affectedRows > 0;
    	}
		
    }
    
  //delete garda ko
    public boolean deleteFromCart(int productId, int userId) throws SQLException, ClassNotFoundException {
        String query = "DELETE FROM cart WHERE product_id = ? AND user_id = ?";
        
        try (Connection conn = dbConnectionObject();
             PreparedStatement ps = conn.prepareStatement(query)) {
            
            ps.setInt(1, productId);
            ps.setInt(2, userId);
            
            return ps.executeUpdate() > 0;
        }
    }
    
    //returning the product_id present in cart
    public Map<Integer, Integer> getProductsFromCart(int userId) {
        Map	<Integer, Integer> productList = new HashMap<>();
        String query = "SELECT product_id, quantity FROM cart WHERE user_id = ?";
        
        try (Connection conn = dbConnectionObject();
             PreparedStatement ps = conn.prepareStatement(query)) {
            
            ps.setInt(1, userId);
            
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    productList.put(rs.getInt("product_id"), rs.getInt("quantity"));
                }
            }
            
            
        } catch (ClassNotFoundException | SQLException e) {
            System.err.println("Error retrieving cart products: " + e.getMessage());
        }
        return productList;
    }
    
    //checking remaining stock from product table
    public int checkRemainingQuantity(int p_id) {
    	int stock =-1;
    	String query = "SELECT stock_quantity FROM products WHERE product_id = ? LIMIT 1";
        
        try (Connection conn = dbConnectionObject();
             PreparedStatement ps = conn.prepareStatement(query)) {
            
            ps.setInt(1, p_id);
            
            try (ResultSet rs = ps.executeQuery()) {
            	 if (rs.next()) {
                     stock = rs.getInt("stock_quantity");
                     if (rs.wasNull()) {
                         stock = -1;
                     }
                 }
            }
        } catch (ClassNotFoundException | SQLException e) {
            System.err.println("Error checking cart: " + e.getMessage());
        }
    	return stock;
    }
      
    
    //checkout maa use vako daatabases query haru
    //total amount return garney function checkout.html load huda dekhanuney
    
    public float getTotalAmountOfCart(int userId) {
    	float total = 0;
    	
    	String query = "SELECT p.price, c.quantity from cart c "
    			+ "JOIN products p ON c.product_id=p.product_id "
    			+"WHERE c.user_id= ?";

        try (Connection conn = dbConnectionObject();
             PreparedStatement preparedStatement = conn.prepareStatement(query)) {
            
            preparedStatement.setInt(1, userId);
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                	int qty= resultSet.getInt("quantity");	  
                	float price = resultSet.getFloat("price");
                	total+= (qty*price);
                }
            }
        } catch (ClassNotFoundException |SQLException e) {
			e.printStackTrace();
		} 
    	
    	return total;
    }
    
    
    public boolean insertAdditionalInfo(User user, int id) throws ClassNotFoundException, SQLException {
		
		String query = "update users set fname=?, lname=?, gender=?, dob=?, address=?, phoneNumber=? where user_id=?";
		try(Connection conn = dbConnectionObject();
		PreparedStatement preparedStatement = conn.prepareStatement(query)){
			preparedStatement.setString(1, user.getFirstName());
			preparedStatement.setString(2, user.getLastName());
			preparedStatement.setString(3, user.getGender());
			preparedStatement.setDate(4, java.sql.Date.valueOf(user.getDob()));
			preparedStatement.setString(5, user.getAddress());
			preparedStatement.setString(6, user.getPhoneNumber());
			preparedStatement.setInt(7, id);
			
			int affectedRows=preparedStatement.executeUpdate();
			return affectedRows>0;
		}
				
	}
    
    //checkout page maa order and shippingdetails maa insert garna
    
    public boolean insertIntoOrders(int userId, String transactionUuid, EsewaAttributes esewa) throws ClassNotFoundException, SQLException {
    	float total = (esewa.getAmount()) +  esewa.getTaxAmt() + esewa.getProductDeliveryCharge() + esewa.getProductServiceCharge();
    	String query = "INSERT INTO orders(order_id, user_id, total_amount) Values(?,?,?)";
    	try(Connection conn = dbConnectionObject();
			PreparedStatement ps = conn.prepareStatement(query)){
    		ps.setString(1, transactionUuid);
			ps.setInt(2, userId);
			ps.setFloat(3, total);
    		int affectedRow = ps.executeUpdate();	
    		return affectedRow>0;
    	}
    }
    
    public boolean insertIntoShippingDetails(ShippingDetails sd, String transaction_uuid) throws ClassNotFoundException, SQLException {
    	String query = "INSERT INTO shipping_details(order_id, full_name, email, phone_number, address, city, state_province, zip_code) Values(?,?,?,?,?,?,?,?)";
    	try(Connection conn = dbConnectionObject();
			PreparedStatement ps = conn.prepareStatement(query)){
    		ps.setString(1, transaction_uuid);
			ps.setString(2, sd.getFullname());
			ps.setString(3, sd.getEmail());
			ps.setString(4, sd.getPhone());
			ps.setString(5, sd.getAddress());
			ps.setString(6, sd.getCity());
			ps.setString(7, sd.getState());
			ps.setString(8, sd.getZip());
			
    		int affectedRow = ps.executeUpdate();	
    		return affectedRow>0;
    	}
    }
    
    
    
    //success or fail huda order ko status change garney, cart ko order-items maa copy garney and payment maa halney
    public boolean changeOrderStatus(String transactionUuid, String status) throws ClassNotFoundException, SQLException {
    	String query = "UPDATE orders set status=? where order_id=?";
		try(Connection conn = dbConnectionObject();
			PreparedStatement ps = conn.prepareStatement(query)){
				ps.setString(1, status);
				ps.setString(2, transactionUuid);
				
	    	int affectedRow = ps.executeUpdate();
	    	return affectedRow>0;
		}
   }
    
    public boolean cutToOrderItems(String orderId) throws ClassNotFoundException, SQLException {
        Connection conn = null;
    	ResultSet rs = null;
        boolean success = false;
        
        try {
            conn = dbConnectionObject();
            conn.setAutoCommit(false); // Start transaction
            
            int userId = 0;
            String getUserSql = "SELECT user_id FROM orders WHERE order_id = ?";
            PreparedStatement pstmt = conn.prepareStatement(getUserSql);
            pstmt.setString(1, orderId);
            rs = pstmt.executeQuery();
            
            if (rs.next()) {
                userId = rs.getInt("user_id");
            } else {
                throw new SQLException("Order not found with ID: " + orderId);
            }
            
            // Get all cart items for this user and insert into order_items
            String moveItemsSql = "INSERT INTO order_items (order_id, product_id, quantity, unit_price) " +
                                 "SELECT ?, c.product_id, c.quantity, p.price " +
                                 "FROM cart c " +
                                 "JOIN products p ON c.product_id = p.product_id " +
                                 "WHERE c.user_id = ?";
            
            pstmt = conn.prepareStatement(moveItemsSql);
            pstmt.setString(1, orderId);
            pstmt.setInt(2, userId);
            int rowsAffected = pstmt.executeUpdate();
            
            if (rowsAffected > 0) {
                // Delete items from cart
                String clearCartSql = "DELETE FROM cart WHERE user_id = ?";
                pstmt = conn.prepareStatement(clearCartSql);
                pstmt.setInt(1, userId);
                pstmt.executeUpdate();
                
                conn.commit(); 
                success = true;
            } else {
                conn.rollback(); // Rollback if no items were moved
            }
            
        } catch (SQLException e) {
            if (conn != null) {
                conn.rollback(); // Rollback on error
            }
            throw e;
        } finally {
            // Clean up resources
            if (rs != null) rs.close();
            if (conn != null) {
                conn.setAutoCommit(true);
                conn.close();
            }
        }
        
        return success;
    }
    
    public boolean insertIntoPayment(EsewaAttributes esewa, String payMethod) throws ClassNotFoundException, SQLException {
        Connection conn = null;
        PreparedStatement pstmt = null;
        boolean success = false;
        
        try {
            conn = dbConnectionObject();
            
            String sql = "INSERT INTO payments (order_id, method, amount, status, transcation_code, ref_id) " +
                         "VALUES (?, ?, ?, ?, ?, ?)";

            pstmt = conn.prepareStatement(sql);
            
            pstmt.setString(1, esewa.getTransaction_uuid());          
            pstmt.setString(2, payMethod);                   
            pstmt.setFloat(3, Float.parseFloat(esewa.getTotal_amount()));
            pstmt.setString(4, esewa.getStatus());   
            if (esewa.getTransaction_code() != null) {
                pstmt.setString(5, esewa.getTransaction_code());       
            } else {
                pstmt.setNull(5, Types.VARCHAR);
            }
            if (esewa.getRef_id() != null) {
                pstmt.setString(6, esewa.getRef_id());       
            } else {
                pstmt.setNull(6, Types.VARCHAR);
            }
            
            int rowsAffected = pstmt.executeUpdate();
            
            success = (rowsAffected > 0);
            
        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (conn != null) {
                conn.close();
            }
        }
        
        return success;
    }
    	
     
    //change password ko db
    public String getEmail(int userId) throws ClassNotFoundException, SQLException {
    	String query = "SELECT email FROM users WHERE user_id = ?";
    	String result = null;
        try (Connection conn = dbConnectionObject();
             PreparedStatement preparedStatement = conn.prepareStatement(query)) {
            
            preparedStatement.setInt(1, userId);
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                if (resultSet.next()) {
                	result= resultSet.getString("email");
	                return result;
                }
            }
        }
        return result;
    }
    
    //change picture
    public boolean changePicturePath(int userId, String filename) throws ClassNotFoundException, SQLException {
    	String query = "UPDATE users set pic=? where user_id=?";
		try(Connection conn = dbConnectionObject();
			PreparedStatement ps = conn.prepareStatement(query)){
				ps.setString(1, filename);
				ps.setInt(2, userId);
				
	    	int affectedRow = ps.executeUpdate();
	    	return affectedRow>0;
		}
    }
    
    //profile fetch
    public Object getUserProfileDetails(int userId) throws ClassNotFoundException, SQLException {
        HashMap<String, Object> userDetails = new HashMap<>();
        String sql = "SELECT u.fname, u.lname, u.dob, u.email, u.phoneNumber, " +
                "u.address, u.pic FROM users u WHERE u.user_id = ?";
        try (Connection conn = dbConnectionObject();            
            PreparedStatement pstmt = conn.prepareStatement(sql)){
            pstmt.setInt(1, userId);
            
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                userDetails.put("firstName", rs.getString("fname"));                
                userDetails.put("lastName", rs.getString("lname"));
                userDetails.put("dob", rs.getDate("dob"));
                userDetails.put("email", rs.getString("email"));
                userDetails.put("phone", rs.getString("phoneNumber"));
                userDetails.put("address", rs.getString("address"));
                userDetails.put("profilePic", rs.getString("pic"));

                return userDetails;
            } 
        }
        return null;
    }
    
    public String getProfileUrl(int userId) {
    	String url="nouser.jpg";
		
    	String sql = "SELECT pic FROM users WHERE user_id = ?";
        try (Connection conn = dbConnectionObject();
             PreparedStatement preparedStatement = conn.prepareStatement(sql)) {
            
            preparedStatement.setInt(1, userId);
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                if (resultSet.next()) {
                	url= resultSet.getString("pic");	 
                }
            }
        } catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		} 
    	return url;
    }
    
    
    //total no of cart item, order
    public int getTotalCartItems(int userId) {
    	int totalItems = 0;
    	String sql = "SELECT COUNT(*) as total FROM cart WHERE user_id = ?";
        try (Connection conn = dbConnectionObject();
             PreparedStatement preparedStatement = conn.prepareStatement(sql)) {
            
            preparedStatement.setInt(1, userId);
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                if (resultSet.next()) {
                	totalItems= resultSet.getInt("total");	 
                }
            }
        } catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		} 
    	return totalItems;
    }
    
    public int getTotalOrders(int userId) {
    	int totalItems = 0;
    	String sql = "SELECT COUNT(*) as total FROM orders WHERE user_id = ?";
        try (Connection conn = dbConnectionObject();
             PreparedStatement preparedStatement = conn.prepareStatement(sql)) {
            
            preparedStatement.setInt(1, userId);
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                if (resultSet.next()) {
                	totalItems= resultSet.getInt("total");	 
                }
            }
        } catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
		} 
    	return totalItems;
    }
    
    public Object getOrders(int userId) throws SQLException, ClassNotFoundException {
    	
    	List <HashMap<String, Object>> orders = new ArrayList<>();
    	    	
        String sql = "SELECT order_id, total_amount, status, created_at from orders WHERE user_id = ?";
        try (Connection conn = dbConnectionObject();            
            PreparedStatement pstmt = conn.prepareStatement(sql)){
            pstmt.setInt(1, userId);
            
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
            	HashMap<String, Object> detail = new HashMap<>();
            	detail.put("order_id", rs.getString("order_id"));                
            	detail.put("totalAmount", rs.getDouble("total_amount"));
            	detail.put("status", rs.getString("status"));
            	detail.put("date", rs.getDate("created_at"));

                orders.add(detail);
            } 
        }
        return orders;
    }
    
    public Object getDetailsOfOrder(String orderId) throws ClassNotFoundException, SQLException {
    	HashMap<String, Object> orderDetails = new HashMap<>();
    	
    	String query = "Select p.image_url, p.name, o.quantity, o.unit_price from order_items o "
    			+ "left join products p on o.product_id=p.product_id "
    			+ "where o.order_id=?";
    	
    	String sql = "Select s.address, s.city, s.state_province, o.created_at, o.status as order_status, "
    			+ "o.total_amount, p.status as payment_status, p.method from orders o "
    			+ "left join shipping_details s on o.order_id=s.order_id "
    			+ "left join payments p on o.order_id=p.order_id "
    			+ "where o.order_id=?";
    	
    	List <Products> products = new ArrayList<>();
    	
    	try (Connection conn = dbConnectionObject();            
                PreparedStatement pstmt = conn.prepareStatement(query)){
                pstmt.setString(1, orderId);
                
                ResultSet rs = pstmt.executeQuery();
                while (rs.next()) {
                	Products p = new Products();
                	p.setUrl(rs.getString("image_url"));
                	p.setName(rs.getString("name"));
                	p.setStock(rs.getInt("quantity"));
                	p.setPrice(rs.getDouble("unit_price"));
                	products.add(p);
                } 
            }
    	orderDetails.put("productsInfo", products);
    	
    	try (Connection conn = dbConnectionObject();            
                PreparedStatement ps = conn.prepareStatement(sql)){
                ps.setString(1, orderId);
                
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                	orderDetails.put("orderId", orderId);
                	orderDetails.put("date", rs.getDate("created_at"));
                	orderDetails.put("orderStatus", rs.getString("order_status"));
                	orderDetails.put("paymentMethod", rs.getString("method"));
                	orderDetails.put("paymentStatus", rs.getString("payment_status"));
                	orderDetails.put("address", rs.getString("address")+" "+rs.getString("city")+" "+rs.getString("state_province"));
                	orderDetails.put("totalAmount", rs.getString("total_amount"));
                } 
            }
    	
    	
    	
    	return orderDetails;
    }
    
    //cancelling orders
    public boolean processOrderCancellation(String orderId) throws SQLException, ClassNotFoundException {
        try (Connection conn = dbConnectionObject()) {
            conn.setAutoCommit(false);
            try {
                boolean itemsRemoved = removeOrdersFromOrderItems(orderId);
                boolean orderUpdated = updateOrderStatus(orderId, "CANCELLED");
                boolean paymentUpdated = updatePaymentStatus(orderId, "Left to be Refunded");
                
                if (itemsRemoved && orderUpdated && paymentUpdated) {
                    conn.commit();
                    return true;
                }
                conn.rollback();
                return false;
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        }
    }
    
    public boolean removeOrdersFromOrderItems(String orderId) throws ClassNotFoundException, SQLException{
    	String query = "DELETE FROM order_items where order_id=?";
		try(Connection conn = dbConnectionObject();
			PreparedStatement ps = conn.prepareStatement(query)){
				ps.setString(1, orderId);
				
	    	int affectedRow = ps.executeUpdate();
	    	return affectedRow>0;
		}
    }
    
	public boolean updateOrderStatus(String orderId, String status) throws ClassNotFoundException, SQLException{
		String query = "UPDATE orders set status=? where order_id=?";
		try(Connection conn = dbConnectionObject();
			PreparedStatement ps = conn.prepareStatement(query)){
				ps.setString(1, status);
				ps.setString(2, orderId);
				
	    	int affectedRow = ps.executeUpdate();
	    	return affectedRow>0;
		}
    }
	
	public boolean updatePaymentStatus(String orderId, String status) throws ClassNotFoundException, SQLException{
		String query = "UPDATE payments set status=? where order_id=?";
		try(Connection conn = dbConnectionObject();
			PreparedStatement ps = conn.prepareStatement(query)){
				ps.setString(1, status);
				ps.setString(2, orderId);
				
	    	int affectedRow = ps.executeUpdate();
	    	return affectedRow>0;
		}
	}
    
    
    
    
}