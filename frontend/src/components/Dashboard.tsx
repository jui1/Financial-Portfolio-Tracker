import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Portfolio, PortfolioDetails } from '../services/api';
import { portfolioAPI } from '../services/api';
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import PortfolioCard from './PortfolioCard';
import CreatePortfolioModal from './CreatePortfolioModal';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await portfolioAPI.getUserPortfolios();
      setPortfolios(response.data);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePortfolio = () => {
    setShowCreateModal(true);
  };

  const handlePortfolioCreated = () => {
    setShowCreateModal(false);
    fetchPortfolios();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Portfolio Tracker</h1>
              <p className="text-gray-600">Welcome back, {user?.username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreatePortfolio}
                className="btn-primary flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Portfolio
              </button>
              <button
                onClick={logout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {portfolios.length === 0 ? (
          <div className="text-center py-12">
            <PieChart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No portfolios</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new portfolio.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreatePortfolio}
                className="btn-primary"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Portfolio
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onUpdate={fetchPortfolios}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Portfolio Modal */}
      {showCreateModal && (
        <CreatePortfolioModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handlePortfolioCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
