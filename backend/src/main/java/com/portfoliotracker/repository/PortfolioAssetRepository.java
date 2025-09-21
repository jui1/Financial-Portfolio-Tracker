package com.portfoliotracker.repository;

import com.portfoliotracker.entity.Portfolio;
import com.portfoliotracker.entity.PortfolioAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioAssetRepository extends JpaRepository<PortfolioAsset, Long> {
    List<PortfolioAsset> findByPortfolio(Portfolio portfolio);
    List<PortfolioAsset> findByPortfolioId(Long portfolioId);
    Optional<PortfolioAsset> findByPortfolioAndTickerSymbol(Portfolio portfolio, String tickerSymbol);
    Optional<PortfolioAsset> findByPortfolioIdAndTickerSymbol(Long portfolioId, String tickerSymbol);
}


