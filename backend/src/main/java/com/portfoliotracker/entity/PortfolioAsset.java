package com.portfoliotracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio_assets")
public class PortfolioAsset {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(name = "ticker_symbol")
    private String tickerSymbol;
    
    @NotNull
    @Positive
    private BigDecimal quantity;
    
    @NotNull
    @Column(name = "purchase_price")
    private BigDecimal purchasePrice;
    
    @Column(name = "current_price")
    private BigDecimal currentPrice;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    @JsonIgnore
    private Portfolio portfolio;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public PortfolioAsset() {}
    
    public PortfolioAsset(String tickerSymbol, BigDecimal quantity, BigDecimal purchasePrice, Portfolio portfolio) {
        this.tickerSymbol = tickerSymbol;
        this.quantity = quantity;
        this.purchasePrice = purchasePrice;
        this.portfolio = portfolio;
    }
    
    // Helper methods
    public BigDecimal getTotalValue() {
        if (currentPrice != null && quantity != null) {
            return currentPrice.multiply(quantity);
        }
        return BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalCost() {
        if (purchasePrice != null && quantity != null) {
            return purchasePrice.multiply(quantity);
        }
        return BigDecimal.ZERO;
    }
    
    public BigDecimal getGainLoss() {
        return getTotalValue().subtract(getTotalCost());
    }
    
    public BigDecimal getGainLossPercentage() {
        BigDecimal totalCost = getTotalCost();
        if (totalCost.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return getGainLoss().divide(totalCost, 4, BigDecimal.ROUND_HALF_UP)
                .multiply(new BigDecimal("100"));
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }
    
    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Portfolio getPortfolio() {
        return portfolio;
    }
    
    public void setPortfolio(Portfolio portfolio) {
        this.portfolio = portfolio;
    }
}


