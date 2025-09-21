import React, { useState, useEffect } from 'react';
import type { Portfolio, PortfolioDetails } from '../services/api';
import { portfolioAPI } from '../services/api';
import { Eye, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onUpdate: () => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio, onUpdate }) => {
  const [details, setDetails] = useState<PortfolioDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPortfolioDetails();
  }, [portfolio.id]);

  const fetchPortfolioDetails = async () => {
    setLoading(true);
    try {
      const response = await portfolioAPI.getPortfolio(portfolio.id);
      setDetails(response.data);
    } catch (error) {
      console.error('Error fetching portfolio details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = () => {
    navigate(`/portfolio/${portfolio.id}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const getGainLossColor = (value: number) => {
    return value >= 0 ? 'text-success-600' : 'text-danger-600';
  };

  const getGainLossIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );
  };

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">{portfolio.name}</h3>
        {portfolio.description && (
          <p className="text-sm text-gray-600 mt-1">{portfolio.description}</p>
        )}
      </div>

      {details && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-lg font-semibold">
                {formatCurrency(details.totalValue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-lg font-semibold">
                {formatCurrency(details.totalCost)}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Gain/Loss</span>
              <div className={`flex items-center space-x-1 ${getGainLossColor(details.totalGainLoss)}`}>
                {getGainLossIcon(details.totalGainLoss)}
                <span className="font-semibold">
                  {formatCurrency(details.totalGainLoss)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-600">Return</span>
              <span className={`font-semibold ${getGainLossColor(details.totalGainLossPercentage)}`}>
                {formatPercentage(details.totalGainLossPercentage)}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Assets</span>
              <span>{details.assets.length}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex space-x-2">
        <button
          onClick={handleView}
          className="flex-1 btn-primary flex items-center justify-center"
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </button>
        <button className="btn-secondary">
          <Edit className="h-4 w-4" />
        </button>
        <button className="btn-danger">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PortfolioCard;
