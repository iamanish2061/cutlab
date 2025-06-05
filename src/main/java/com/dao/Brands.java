package com.dao;

public class Brands {

	private String name;
	private String description;
	private boolean is_vegan;
	
	public Brands() {
		
	}
	
	public Brands(String name, String description, boolean is_vegan) {
		super();
		this.name = name;
		this.description = description;
		this.is_vegan = is_vegan;
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
	public boolean isIs_vegan() {
		return is_vegan;
	}
	public void setIs_vegan(boolean is_vegan) {
		this.is_vegan = is_vegan;
	}
	
	
	
}
