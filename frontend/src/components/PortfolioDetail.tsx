import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PortfolioDetails, Asset } from '../services/api';
import { portfolioAPI, stockAPI } from '../services/api';
import { ArrowLeft, Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import AddAssetModal from './AddAssetModal';
import PortfolioChart from './PortfolioChart';

const PortfolioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<PortfolioDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPortfolio();
    }
  }, [id]);

  const fetchPortfolio = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await portfolioAPI.getPortfolio(parseInt(id));
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAsset = async (assetId: number) => {
    if (!id) return;
    
    try {
      await portfolioAPI.removeAsset(parseInt(id), assetId);
      fetchPortfolio();
    } catch (error) {
      console.error('Error removing asset:', error);
    }
  };

  const handleAssetAdded = () => {
    setShowAddAssetModal(false);
    fetchPortfolio();
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Portfolio not found</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate('/')}
              className="mr-4 btn-secondary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{portfolio.name}</h1>
              {portfolio.description && (
                <p className="text-gray-600">{portfolio.description}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold">{formatCurrency(portfolio.totalCost)}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              {getGainLossIcon(portfolio.totalGainLoss)}
              <div className="ml-4">
                <p className="text-sm text-gray-600">Gain/Loss</p>
                <p className={`text-2xl font-bold ${getGainLossColor(portfolio.totalGainLoss)}`}>
                  {formatCurrency(portfolio.totalGainLoss)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              {getGainLossIcon(portfolio.totalGainLossPercentage)}
              <div className="ml-4">
                <p className="text-sm text-gray-600">Return</p>
                <p className={`text-2xl font-bold ${getGainLossColor(portfolio.totalGainLossPercentage)}`}>
                  {formatPercentage(portfolio.totalGainLossPercentage)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Portfolio Allocation</h3>
            <PortfolioChart portfolio={portfolio} />
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
            <div className="text-center py-8 text-gray-500">
              Performance chart coming soon...
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Assets</h3>
            <button
              onClick={() => setShowAddAssetModal(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </button>
          </div>

          {portfolio.assets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No assets in this portfolio. Add your first asset to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Symbol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchase Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gain/Loss
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolio.assets.map((asset) => (
                    <tr key={asset.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {asset.tickerSymbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {asset.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(asset.purchasePrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(asset.currentPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(asset.totalValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={`flex items-center space-x-1 ${getGainLossColor(asset.gainLoss)}`}>
                          {getGainLossIcon(asset.gainLoss)}
                          <span>{formatCurrency(asset.gainLoss)}</span>
                          <span>({formatPercentage(asset.gainLossPercentage)})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleRemoveAsset(asset.id)}
                          className="text-danger-600 hover:text-danger-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Asset Modal */}
      {showAddAssetModal && (
        <AddAssetModal
          portfolioId={parseInt(id!)}
          onClose={() => setShowAddAssetModal(false)}
          onSuccess={handleAssetAdded}
        />
      )}
    </div>
  );
};

export default PortfolioDetail;
