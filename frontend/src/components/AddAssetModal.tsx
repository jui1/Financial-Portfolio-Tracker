import React, { useState } from 'react';
import type { AssetRequest } from '../services/api';
import { portfolioAPI, stockAPI } from '../services/api';
import { X, Search } from 'lucide-react';

interface AddAssetModalProps {
  portfolioId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({ portfolioId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<AssetRequest>({
    tickerSymbol: '',
    quantity: 0,
    purchasePrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stockInfo, setStockInfo] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await portfolioAPI.addAsset(portfolioId, formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add asset');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'tickerSymbol' ? value.toUpperCase() : parseFloat(value) || 0,
    });
  };

  const handleSearchStock = async () => {
    if (!formData.tickerSymbol) return;
    
    setSearching(true);
    try {
      const response = await stockAPI.getQuote(formData.tickerSymbol);
      setStockInfo(response.data);
      if (response.data.price) {
        setFormData(prev => ({
          ...prev,
          purchasePrice: response.data.price,
        }));
      }
    } catch (error) {
      setError('Stock not found or API error');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Asset</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tickerSymbol" className="block text-sm font-medium text-gray-700">
              Ticker Symbol
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="tickerSymbol"
                name="tickerSymbol"
                required
                className="flex-1 input-field rounded-r-none"
                placeholder="e.g., AAPL"
                value={formData.tickerSymbol}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={handleSearchStock}
                disabled={searching || !formData.tickerSymbol}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                {searching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {stockInfo && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium text-gray-900">{stockInfo.symbol}</h4>
              <p className="text-sm text-gray-600">
                Current Price: ${stockInfo.price?.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Change: {stockInfo.changePercent}
              </p>
            </div>
          )}

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              required
              min="0"
              step="0.01"
              className="input-field mt-1"
              placeholder="Enter quantity"
              value={formData.quantity || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">
              Purchase Price
            </label>
            <input
              type="number"
              id="purchasePrice"
              name="purchasePrice"
              required
              min="0"
              step="0.01"
              className="input-field mt-1"
              placeholder="Enter purchase price"
              value={formData.purchasePrice || ''}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className="text-danger-600 text-sm">{error}</div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? 'Adding...' : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
