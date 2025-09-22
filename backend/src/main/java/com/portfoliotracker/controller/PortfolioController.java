package com.portfoliotracker.controller;

import com.portfoliotracker.dto.AssetRequest;
import com.portfoliotracker.dto.PortfolioRequest;
import com.portfoliotracker.dto.PortfolioResponse;
import com.portfoliotracker.entity.Portfolio;
import com.portfoliotracker.entity.User;
import com.portfoliotracker.service.PortfolioService;
import com.portfoliotracker.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolios")
@CrossOrigin(origins = "*")
public class PortfolioController {
    
    @Autowired
    private PortfolioService portfolioService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<?> createPortfolio(@Valid @RequestBody PortfolioRequest request, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        Portfolio portfolio = portfolioService.createPortfolio(request, user);
        
        return ResponseEntity.ok(Map.of(
                "id", portfolio.getId(),
                "name", portfolio.getName(),
                "message", "Portfolio created successfully"
        ));
    }
    
    @GetMapping
    public ResponseEntity<List<Portfolio>> getUserPortfolios(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        List<Portfolio> portfolios = portfolioService.getUserPortfolios(user);
        return ResponseEntity.ok(portfolios);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPortfolio(@PathVariable Long id, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        PortfolioResponse portfolio = portfolioService.getPortfolioWithDetails(id, user);
        return ResponseEntity.ok(portfolio);
    }
    
    @PostMapping("/{id}/assets")
    public ResponseEntity<?> addAsset(@PathVariable Long id, @Valid @RequestBody AssetRequest request, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        try {
            portfolioService.addAssetToPortfolio(id, request, user);
            return ResponseEntity.ok(Map.of("message", "Asset added successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{portfolioId}/assets/{assetId}")
    public ResponseEntity<?> removeAsset(@PathVariable Long portfolioId, @PathVariable Long assetId, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        try {
            portfolioService.removeAssetFromPortfolio(portfolioId, assetId, user);
            return ResponseEntity.ok(Map.of("message", "Asset removed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}



