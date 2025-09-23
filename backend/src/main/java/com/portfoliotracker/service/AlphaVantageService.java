package com.portfoliotracker.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class AlphaVantageService {
    
    @Value("${alpha.vantage.api.key}")
    private String apiKey;
    
    @Value("${alpha.vantage.base.url}")
    private String baseUrl;
    
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    public AlphaVantageService() {
        this.webClient = WebClient.builder().build();
        this.objectMapper = new ObjectMapper();
    }
    
    public Map<String, Object> getStockQuote(String symbol) {
        try {
            String url = baseUrl + "?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=" + apiKey;
            
            String response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode quoteNode = jsonNode.get("Global Quote");
            
            if (quoteNode != null) {
                Map<String, Object> stockData = new HashMap<>();
                stockData.put("symbol", quoteNode.get("01. symbol").asText());
                stockData.put("price", new BigDecimal(quoteNode.get("05. price").asText()));
                stockData.put("change", new BigDecimal(quoteNode.get("09. change").asText()));
                stockData.put("changePercent", quoteNode.get("10. change percent").asText());
                stockData.put("volume", quoteNode.get("06. volume").asLong());
                stockData.put("previousClose", new BigDecimal(quoteNode.get("08. previous close").asText()));
                stockData.put("open", new BigDecimal(quoteNode.get("02. open").asText()));
                stockData.put("high", new BigDecimal(quoteNode.get("03. high").asText()));
                stockData.put("low", new BigDecimal(quoteNode.get("04. low").asText()));
                
                return stockData;
            }
            
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    public Map<String, Object> getStockOverview(String symbol) {
        try {
            String url = baseUrl + "?function=OVERVIEW&symbol=" + symbol + "&apikey=" + apiKey;
            
            String response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            
            JsonNode jsonNode = objectMapper.readTree(response);
            
            if (jsonNode.has("Symbol")) {
                Map<String, Object> overview = new HashMap<>();
                overview.put("symbol", jsonNode.get("Symbol").asText());
                overview.put("name", jsonNode.get("Name").asText());
                overview.put("description", jsonNode.get("Description").asText());
                overview.put("sector", jsonNode.get("Sector").asText());
                overview.put("industry", jsonNode.get("Industry").asText());
                overview.put("marketCap", jsonNode.get("MarketCapitalization").asText());
                overview.put("peRatio", jsonNode.get("PERatio").asText());
                overview.put("dividendYield", jsonNode.get("DividendYield").asText());
                
                return overview;
            }
            
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    public Map<String, Object> getTimeSeriesDaily(String symbol) {
        try {
            String url = baseUrl + "?function=TIME_SERIES_DAILY&symbol=" + symbol + "&apikey=" + apiKey;
            
            String response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode timeSeriesNode = jsonNode.get("Time Series (Daily)");
            
            if (timeSeriesNode != null) {
                Map<String, Object> timeSeries = new HashMap<>();
                timeSeries.put("symbol", jsonNode.get("Meta Data").get("2. Symbol").asText());
                timeSeries.put("data", timeSeriesNode);
                
                return timeSeries;
            }
            
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}





