package com.portfoliotracker.service;

import com.portfoliotracker.entity.PortfolioAsset;
import com.portfoliotracker.repository.PortfolioAssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class AISimulationService {
    
    @Autowired
    private PortfolioAssetRepository portfolioAssetRepository;
    
    @Autowired
    private AlphaVantageService alphaVantageService;
    
    public Map<String, Object> calculateDiversificationScore(Long portfolioId) {
        List<PortfolioAsset> assets = portfolioAssetRepository.findByPortfolioId(portfolioId);
        
        if (assets.isEmpty()) {
            Map<String, Object> result = new HashMap<>();
            result.put("score", 0);
            result.put("message", "No assets in portfolio");
            return result;
        }
        
        // Calculate diversification metrics
        int assetCount = assets.size();
        BigDecimal totalValue = assets.stream()
                .map(PortfolioAsset::getTotalValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate concentration risk (Herfindahl-Hirschman Index)
        BigDecimal hhi = BigDecimal.ZERO;
        for (PortfolioAsset asset : assets) {
            BigDecimal weight = asset.getTotalValue().divide(totalValue, 4, RoundingMode.HALF_UP);
            hhi = hhi.add(weight.multiply(weight));
        }
        
        // Convert HHI to diversification score (0-100)
        BigDecimal diversificationScore = BigDecimal.valueOf(100)
                .subtract(hhi.multiply(BigDecimal.valueOf(100)));
        
        // Adjust score based on number of assets
        if (assetCount >= 10) {
            diversificationScore = diversificationScore.multiply(new BigDecimal("1.1"));
        } else if (assetCount >= 5) {
            diversificationScore = diversificationScore.multiply(new BigDecimal("1.05"));
        }
        
        // Cap at 100
        if (diversificationScore.compareTo(BigDecimal.valueOf(100)) > 0) {
            diversificationScore = BigDecimal.valueOf(100);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("score", diversificationScore.setScale(2, RoundingMode.HALF_UP));
        result.put("assetCount", assetCount);
        result.put("hhi", hhi.setScale(4, RoundingMode.HALF_UP));
        result.put("message", getDiversificationMessage(diversificationScore));
        
        return result;
    }
    
    public Map<String, Object> generateRecommendation(Long portfolioId) {
        List<PortfolioAsset> assets = portfolioAssetRepository.findByPortfolioId(portfolioId);
        
        // Analyze current portfolio
        Map<String, Object> diversification = calculateDiversificationScore(portfolioId);
        BigDecimal score = (BigDecimal) diversification.get("score");
        
        Map<String, Object> recommendation = new HashMap<>();
        
        if (score.compareTo(new BigDecimal("70")) < 0) {
            // Low diversification - recommend adding more assets
            recommendation.put("type", "DIVERSIFICATION");
            recommendation.put("priority", "HIGH");
            recommendation.put("message", "Your portfolio has low diversification. Consider adding more assets from different sectors.");
            recommendation.put("suggestedAssets", getSuggestedAssetsForDiversification());
        } else if (assets.size() < 5) {
            // Few assets - recommend expanding
            recommendation.put("type", "EXPANSION");
            recommendation.put("priority", "MEDIUM");
            recommendation.put("message", "Consider adding more assets to improve portfolio stability.");
            recommendation.put("suggestedAssets", getSuggestedAssetsForExpansion());
        } else {
            // Well diversified - suggest optimization
            recommendation.put("type", "OPTIMIZATION");
            recommendation.put("priority", "LOW");
            recommendation.put("message", "Your portfolio is well diversified. Consider rebalancing based on market conditions.");
            recommendation.put("suggestedAssets", getSuggestedAssetsForOptimization());
        }
        
        return recommendation;
    }
    
    private String getDiversificationMessage(BigDecimal score) {
        if (score.compareTo(new BigDecimal("80")) >= 0) {
            return "Excellent diversification! Your portfolio is well spread across different assets.";
        } else if (score.compareTo(new BigDecimal("60")) >= 0) {
            return "Good diversification. Consider adding a few more assets for better risk distribution.";
        } else if (score.compareTo(new BigDecimal("40")) >= 0) {
            return "Moderate diversification. Adding more diverse assets would improve your portfolio.";
        } else {
            return "Low diversification. Consider adding more assets from different sectors and asset classes.";
        }
    }
    
    private List<String> getSuggestedAssetsForDiversification() {
        return List.of("VTI", "VEA", "VWO", "BND", "VNQ", "GLD", "TLT", "IWM");
    }
    
    private List<String> getSuggestedAssetsForExpansion() {
        return List.of("SPY", "QQQ", "IWM", "EFA", "EEM", "AGG", "LQD", "HYG");
    }
    
    private List<String> getSuggestedAssetsForOptimization() {
        return List.of("VTI", "VXUS", "BND", "VNQ", "GLD", "TLT", "IEFA", "IEMG");
    }
    
    public Map<String, Object> simulatePortfolioPerformance(Long portfolioId, int days) {
        List<PortfolioAsset> assets = portfolioAssetRepository.findByPortfolioId(portfolioId);
        
        Map<String, Object> simulation = new HashMap<>();
        simulation.put("portfolioId", portfolioId);
        simulation.put("simulationDays", days);
        
        // Simple Monte Carlo simulation
        Random random = new Random();
        BigDecimal totalCurrentValue = assets.stream()
                .map(PortfolioAsset::getTotalValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Simulate daily returns
        BigDecimal[] dailyReturns = new BigDecimal[days];
        BigDecimal cumulativeReturn = BigDecimal.ZERO;
        
        for (int i = 0; i < days; i++) {
            // Generate random daily return (-5% to +5%)
            double randomReturn = (random.nextDouble() - 0.5) * 0.1; // -5% to +5%
            BigDecimal dailyReturn = BigDecimal.valueOf(randomReturn);
            dailyReturns[i] = dailyReturn;
            cumulativeReturn = cumulativeReturn.add(dailyReturn);
        }
        
        BigDecimal finalValue = totalCurrentValue.multiply(BigDecimal.ONE.add(cumulativeReturn));
        BigDecimal totalReturn = finalValue.subtract(totalCurrentValue);
        BigDecimal returnPercentage = totalReturn.divide(totalCurrentValue, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
        
        simulation.put("currentValue", totalCurrentValue);
        simulation.put("simulatedValue", finalValue);
        simulation.put("totalReturn", totalReturn);
        simulation.put("returnPercentage", returnPercentage);
        simulation.put("dailyReturns", dailyReturns);
        
        return simulation;
    }
}



