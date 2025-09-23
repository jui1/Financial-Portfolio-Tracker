package com.portfoliotracker.exception;

public class PortfolioNotFoundException extends RuntimeException {
    public PortfolioNotFoundException(String message) {
        super(message);
    }
    
    public PortfolioNotFoundException(Long portfolioId) {
        super("Portfolio with ID " + portfolioId + " not found");
    }
}


