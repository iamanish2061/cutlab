package com.dao;

import java.util.List;

public class Products {
	private int id;
    private String name;
    private String description;
    private double price;
    private String url;
    private int stock;
    private Categories category;
    private Brands brand;
    private String gender;    
    private List<String> ingredients;
    private List<String> tags;

    // Constructors
    public Products() {
    	
    }
    
    public Products(String name, String description, double price, String url, int stock, Categories category, Brands brand, String gender, List<String> ingredients, List<String> tags) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.url = url;
        this.stock = stock;
        this.category = category;
        this.brand = brand;
        this.gender = gender;        
        this.ingredients = ingredients;
        this.tags = tags;
    }

    public int getId() {
    	return id;
    }
    
    public void setId(int id) {
    	this.id = id;
    }
    
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public int getStock() {
		return stock;
	}

	public void setStock(int stock) {
		this.stock = stock;
	}

	public Categories getCategory() {
		return category;
	}

	public void setCategory(Categories category) {
		this.category = category;
	}

	public Brands getBrand() {
		return brand;
	}

	public void setBrand(Brands brand) {
		this.brand = brand;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public List<String> getIngredients() {
		return ingredients;
	}

	public void setIngredients(List<String> ingredients) {
		this.ingredients = ingredients;
	}

	public List<String> getTags() {
		return tags;
	}

	public void setTags(List<String> tags) {
		this.tags = tags;
	}

    
    
}