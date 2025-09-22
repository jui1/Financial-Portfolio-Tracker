package com.portfoliotracker.controller;

import com.portfoliotracker.service.AISimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/insights")
@CrossOrigin(origins = "*")
public class InsightsController {
    
    @Autowired
    private AISimulationService aiSimulationService;
    
    @GetMapping("/diversification/{portfolioId}")
    public ResponseEntity<?> getDiversificationScore(@PathVariable Long portfolioId, Authentication authentication) {
        try {
            Map<String, Object> diversification = aiSimulationService.calculateDiversificationScore(portfolioId);
            return ResponseEntity.ok(diversification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/recommendations/{portfolioId}")
    public ResponseEntity<?> getRecommendations(@PathVariable Long portfolioId, Authentication authentication) {
        try {
            Map<String, Object> recommendations = aiSimulationService.generateRecommendation(portfolioId);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/simulation/{portfolioId}")
    public ResponseEntity<?> simulatePortfolioPerformance(
            @PathVariable Long portfolioId,
            @RequestParam(defaultValue = "30") int days,
            Authentication authentication) {
        try {
            Map<String, Object> simulation = aiSimulationService.simulatePortfolioPerformance(portfolioId, days);
            return ResponseEntity.ok(simulation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}



