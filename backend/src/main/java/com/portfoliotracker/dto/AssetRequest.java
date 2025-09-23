package com.portfoliotracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class AssetRequest {
    
    @NotBlank
    private String tickerSymbol;
    
    @NotNull
    @Positive
    private BigDecimal quantity;
    
    @NotNull
    @Positive
    private BigDecimal purchasePrice;
    
    // Constructors
    public AssetRequest() {}
    
    public AssetRequest(String tickerSymbol, BigDecimal quantity, BigDecimal purchasePrice) {
        this.tickerSymbol = tickerSymbol;
        this.quantity = quantity;
        this.purchasePrice = purchasePrice;
    }
    
    // Getters and Setters
    public String getTickerSymbol() {
        return tickerSymbol;
    }
    
    public void setTickerSymbol(String tickerSymbol) {
        this.tickerSymbol = tickerSymbol;
    }
    
    public BigDecimal getQuantity() {
        return quantity;
    }
    
    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }
    
    public BigDecimal getPurchasePrice() {
        return purchasePrice;
    }
    
    public void setPurchasePrice(BigDecimal purchasePrice) {
        this.purchasePrice = purchasePrice;
    }
}



