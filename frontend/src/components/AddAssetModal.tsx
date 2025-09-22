import React, { useState } from 'react';
import type { AssetRequest } from '../services/api';
import { portfolioAPI, stockAPI } from '../services/api';
import { X, Search, AlertCircle } from 'lucide-react';

interface AddAssetModalProps {
  portfolioId: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface ValidationErrors {
  tickerSymbol?: string;
  quantity?: string;
  purchasePrice?: string;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({ portfolioId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<AssetRequest>({
    tickerSymbol: '',
    quantity: 0,
    purchasePrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [stockInfo, setStockInfo] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  // Validation functions
  const validateTickerSymbol = (tickerSymbol: string): string | undefined => {
    if (!tickerSymbol.trim()) {
      return 'Ticker symbol is required';
    }
    if (tickerSymbol.length < 1) {
      return 'Ticker symbol must be at least 1 character';
    }
    if (tickerSymbol.length > 10) {
      return 'Ticker symbol must be less than 10 characters';
    }
    if (!/^[A-Z0-9.-]+$/.test(tickerSymbol.toUpperCase())) {
      return 'Ticker symbol can only contain letters, numbers, dots, and hyphens';
    }
    return undefined;
  };

  const validateQuantity = (quantity: number): string | undefined => {
    if (quantity <= 0) {
      return 'Quantity must be greater than 0';
    }
    if (quantity < 0.01) {
      return 'Quantity must be at least 0.01';
    }
    return undefined;
  };

  const validatePurchasePrice = (purchasePrice: number): string | undefined => {
    if (purchasePrice <= 0) {
      return 'Purchase price must be greater than 0';
    }
    if (purchasePrice < 0.01) {
      return 'Purchase price must be at least 0.01';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    const tickerError = validateTickerSymbol(formData.tickerSymbol);
    if (tickerError) errors.tickerSymbol = tickerError;

    const quantityError = validateQuantity(formData.quantity);
    if (quantityError) errors.quantity = quantityError;

    const priceError = validatePurchasePrice(formData.purchasePrice);
    if (priceError) errors.purchasePrice = priceError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      await portfolioAPI.addAsset(portfolioId, formData);
      onSuccess();
    } catch (err: any) {
      // Handle server validation errors
      if (err.response?.data && typeof err.response.data === 'object') {
        const serverErrors: ValidationErrors = {};
        Object.keys(err.response.data).forEach(key => {
          if (key === 'tickerSymbol') serverErrors.tickerSymbol = err.response.data[key];
          if (key === 'quantity') serverErrors.quantity = err.response.data[key];
          if (key === 'purchasePrice') serverErrors.purchasePrice = err.response.data[key];
        });
        if (Object.keys(serverErrors).length > 0) {
          setValidationErrors(serverErrors);
          return;
        }
      }
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

    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined,
      });
    }
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
                className={`flex-1 input-field rounded-r-none ${
                  validationErrors.tickerSymbol ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                }`}
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
            {validationErrors.tickerSymbol && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {validationErrors.tickerSymbol}
              </div>
            )}
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
              min="0.01"
              step="0.01"
              className={`input-field mt-1 ${
                validationErrors.quantity ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
              }`}
              placeholder="Enter quantity"
              value={formData.quantity || ''}
              onChange={handleChange}
            />
            {validationErrors.quantity && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {validationErrors.quantity}
              </div>
            )}
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
              min="0.01"
              step="0.01"
              className={`input-field mt-1 ${
                validationErrors.purchasePrice ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
              }`}
              placeholder="Enter purchase price"
              value={formData.purchasePrice || ''}
              onChange={handleChange}
            />
            {validationErrors.purchasePrice && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {validationErrors.purchasePrice}
              </div>
            )}
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
