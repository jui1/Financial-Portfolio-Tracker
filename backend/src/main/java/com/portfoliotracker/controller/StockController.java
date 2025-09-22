package com.portfoliotracker.controller;

import com.portfoliotracker.service.AlphaVantageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "*")
public class StockController {
    
    @Autowired
    private AlphaVantageService alphaVantageService;
    
    @GetMapping("/quote/{symbol}")
    public ResponseEntity<?> getStockQuote(@PathVariable String symbol) {
        Map<String, Object> quote = alphaVantageService.getStockQuote(symbol);
        if (quote != null) {
            return ResponseEntity.ok(quote);
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Unable to fetch stock quote"));
        }
    }
    
    @GetMapping("/overview/{symbol}")
    public ResponseEntity<?> getStockOverview(@PathVariable String symbol) {
        Map<String, Object> overview = alphaVantageService.getStockOverview(symbol);
        if (overview != null) {
            return ResponseEntity.ok(overview);
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Unable to fetch stock overview"));
        }
    }
    
    @GetMapping("/timeseries/{symbol}")
    public ResponseEntity<?> getTimeSeries(@PathVariable String symbol) {
        Map<String, Object> timeSeries = alphaVantageService.getTimeSeriesDaily(symbol);
        if (timeSeries != null) {
            return ResponseEntity.ok(timeSeries);
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Unable to fetch time series data"));
        }
    }
}



