import React, { useState } from 'react';
import { portfolioAPI } from '../services/api';
import { X, AlertCircle } from 'lucide-react';

interface CreatePortfolioModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ValidationErrors {
  name?: string;
  description?: string;
}

const CreatePortfolioModal: React.FC<CreatePortfolioModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'Portfolio name is required';
    }
    if (name.length < 3) {
      return 'Portfolio name must be at least 3 characters long';
    }
    if (name.length > 100) {
      return 'Portfolio name must be less than 100 characters';
    }
    return undefined;
  };

  const validateDescription = (description: string): string | undefined => {
    if (description.length > 500) {
      return 'Description must be less than 500 characters';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    const nameError = validateName(formData.name);
    if (nameError) errors.name = nameError;

    const descriptionError = validateDescription(formData.description);
    if (descriptionError) errors.description = descriptionError;

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
      await portfolioAPI.createPortfolio(formData);
      onSuccess();
    } catch (err: any) {
      // Handle server validation errors
      if (err.response?.data && typeof err.response.data === 'object') {
        const serverErrors: ValidationErrors = {};
        Object.keys(err.response.data).forEach(key => {
          if (key === 'name') serverErrors.name = err.response.data[key];
          if (key === 'description') serverErrors.description = err.response.data[key];
        });
        if (Object.keys(serverErrors).length > 0) {
          setValidationErrors(serverErrors);
          return;
        }
      }
      setError(err.response?.data?.message || 'Failed to create portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create New Portfolio</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Portfolio Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className={`input-field mt-1 ${
                validationErrors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
              }`}
              placeholder="Enter portfolio name"
              value={formData.name}
              onChange={handleChange}
            />
            {validationErrors.name && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {validationErrors.name}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className={`input-field mt-1 ${
                validationErrors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
              }`}
              placeholder="Enter portfolio description"
              value={formData.description}
              onChange={handleChange}
            />
            {validationErrors.description && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {validationErrors.description}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </div>
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
              {loading ? 'Creating...' : 'Create Portfolio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePortfolioModal;



