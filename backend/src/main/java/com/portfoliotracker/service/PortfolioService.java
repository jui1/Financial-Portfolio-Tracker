package com.portfoliotracker.service;

import com.portfoliotracker.dto.AssetRequest;
import com.portfoliotracker.dto.AssetResponse;
import com.portfoliotracker.dto.PortfolioRequest;
import com.portfoliotracker.dto.PortfolioResponse;
import com.portfoliotracker.entity.Portfolio;
import com.portfoliotracker.entity.PortfolioAsset;
import com.portfoliotracker.entity.User;
import com.portfoliotracker.repository.PortfolioAssetRepository;
import com.portfoliotracker.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PortfolioService {
    
    @Autowired
    private PortfolioRepository portfolioRepository;
    
    @Autowired
    private PortfolioAssetRepository portfolioAssetRepository;
    
    @Autowired
    private AlphaVantageService alphaVantageService;
    
    public Portfolio createPortfolio(PortfolioRequest request, User user) {
        Portfolio portfolio = new Portfolio(request.getName(), request.getDescription(), user);
        return portfolioRepository.save(portfolio);
    }
    
    public List<Portfolio> getUserPortfolios(User user) {
        return portfolioRepository.findByUser(user);
    }
    
    public Optional<Portfolio> getPortfolioById(Long id, User user) {
        return portfolioRepository.findById(id)
                .filter(portfolio -> portfolio.getUser().getId().equals(user.getId()));
    }
    
    public PortfolioAsset addAssetToPortfolio(Long portfolioId, AssetRequest request, User user) {
        Portfolio portfolio = getPortfolioById(portfolioId, user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        // Check if asset already exists
        Optional<PortfolioAsset> existingAsset = portfolioAssetRepository
                .findByPortfolioAndTickerSymbol(portfolio, request.getTickerSymbol());
        
        if (existingAsset.isPresent()) {
            // Update existing asset quantity
            PortfolioAsset asset = existingAsset.get();
            BigDecimal newQuantity = asset.getQuantity().add(request.getQuantity());
            asset.setQuantity(newQuantity);
            return portfolioAssetRepository.save(asset);
        } else {
            // Create new asset
            PortfolioAsset asset = new PortfolioAsset(
                    request.getTickerSymbol(),
                    request.getQuantity(),
                    request.getPurchasePrice(),
                    portfolio
            );
            
            // Fetch current price
            Map<String, Object> stockData = alphaVantageService.getStockQuote(request.getTickerSymbol());
            if (stockData != null) {
                asset.setCurrentPrice((BigDecimal) stockData.get("price"));
            }
            
            return portfolioAssetRepository.save(asset);
        }
    }
    
    public void removeAssetFromPortfolio(Long portfolioId, Long assetId, User user) {
        Portfolio portfolio = getPortfolioById(portfolioId, user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        PortfolioAsset asset = portfolioAssetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
        
        if (!asset.getPortfolio().getId().equals(portfolio.getId())) {
            throw new RuntimeException("Asset does not belong to this portfolio");
        }
        
        portfolioAssetRepository.delete(asset);
    }
    
    public PortfolioResponse getPortfolioWithDetails(Long portfolioId, User user) {
        Portfolio portfolio = getPortfolioById(portfolioId, user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        List<PortfolioAsset> assets = portfolioAssetRepository.findByPortfolio(portfolio);
        
        // Update current prices for all assets
        for (PortfolioAsset asset : assets) {
            Map<String, Object> stockData = alphaVantageService.getStockQuote(asset.getTickerSymbol());
            if (stockData != null) {
                asset.setCurrentPrice((BigDecimal) stockData.get("price"));
                portfolioAssetRepository.save(asset);
            }
        }
        
        // Convert to response DTO
        PortfolioResponse response = new PortfolioResponse();
        response.setId(portfolio.getId());
        response.setName(portfolio.getName());
        response.setDescription(portfolio.getDescription());
        response.setCreatedAt(portfolio.getCreatedAt());
        response.setUpdatedAt(portfolio.getUpdatedAt());
        response.setUserId(portfolio.getUser().getId());
        
        List<AssetResponse> assetResponses = assets.stream()
                .map(this::convertToAssetResponse)
                .collect(Collectors.toList());
        
        response.setAssets(assetResponses);
        
        // Calculate totals
        BigDecimal totalValue = assets.stream()
                .map(PortfolioAsset::getTotalValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalCost = assets.stream()
                .map(PortfolioAsset::getTotalCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalGainLoss = totalValue.subtract(totalCost);
        BigDecimal totalGainLossPercentage = totalCost.compareTo(BigDecimal.ZERO) == 0 
                ? BigDecimal.ZERO 
                : totalGainLoss.divide(totalCost, 4, BigDecimal.ROUND_HALF_UP)
                    .multiply(new BigDecimal("100"));
        
        response.setTotalValue(totalValue);
        response.setTotalCost(totalCost);
        response.setTotalGainLoss(totalGainLoss);
        response.setTotalGainLossPercentage(totalGainLossPercentage);
        
        return response;
    }
    
    private AssetResponse convertToAssetResponse(PortfolioAsset asset) {
        AssetResponse response = new AssetResponse();
        response.setId(asset.getId());
        response.setTickerSymbol(asset.getTickerSymbol());
        response.setQuantity(asset.getQuantity());
        response.setPurchasePrice(asset.getPurchasePrice());
        response.setCurrentPrice(asset.getCurrentPrice());
        response.setTotalValue(asset.getTotalValue());
        response.setTotalCost(asset.getTotalCost());
        response.setGainLoss(asset.getGainLoss());
        response.setGainLossPercentage(asset.getGainLossPercentage());
        response.setCreatedAt(asset.getCreatedAt());
        response.setUpdatedAt(asset.getUpdatedAt());
        return response;
    }
}
