package com.esewa;

public class EsewaAttributes {

	public static final String MERCHANT_ID = "EPAYTEST";
    public static final String SECRET_KEY = "8gBm/:&EnhH.1/q";
    public static final String PAYMENT_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    public static final String SUCCESS_URL = "http://localhost:8080/cutlab/responseHandle";
    public static final String FAIL_URL = "http://localhost:8080/cutlab/responseHandle";
    public static final String VERIFICATION_URL = "https://rc.esewa.com.np/api/epay/transaction/status/";
	
	private float amount;
	private float taxAmt;
	private float productServiceCharge;
	private float productDeliveryCharge;
	
	//for response
	private String transaction_code;
    private String status;
    private String total_amount;
    private String transaction_uuid;
    private String product_code;
    private String signed_field_names;
    private String signature;
    
    
	public float getAmount() {
		return amount;
	}
	public void setAmount(float amount) {
		this.amount = amount;
	}
	public float getTaxAmt() {
		return taxAmt;
	}
	public void setTaxAmt(float taxAmt) {
		this.taxAmt = taxAmt;
	}
	public float getProductServiceCharge() {
		return productServiceCharge;
	}
	public void setProductServiceCharge(float productServiceCharge) {
		this.productServiceCharge = productServiceCharge;
	}
	public float getProductDeliveryCharge() {
		return productDeliveryCharge;
	}
	public void setProductDeliveryCharge(float productDeliveryCharge) {
		this.productDeliveryCharge = productDeliveryCharge;
	}
	public String getTransaction_code() {
		return transaction_code;
	}
	public void setTransaction_code(String transaction_code) {
		this.transaction_code = transaction_code;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getTotal_amount() {
		return total_amount;
	}
	public void setTotal_amount(String total_amount) {
		this.total_amount = total_amount;
	}
	public String getTransaction_uuid() {
		return transaction_uuid;
	}
	public void setTransaction_uuid(String transaction_uuid) {
		this.transaction_uuid = transaction_uuid;
	}
	public String getProduct_code() {
		return product_code;
	}
	public void setProduct_code(String product_code) {
		this.product_code = product_code;
	}
	public String getSigned_field_names() {
		return signed_field_names;
	}
	public void setSigned_field_names(String signed_field_names) {
		this.signed_field_names = signed_field_names;
	}
	public String getSignature() {
		return signature;
	}
	public void setSignature(String signature) {
		this.signature = signature;
	}
	
    
  
	
}
