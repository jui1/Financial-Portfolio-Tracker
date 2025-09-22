import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://portfolio-tracker-latest-2.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface AuthRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  username: string;
  email: string;
}

export interface Portfolio {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface PortfolioRequest {
  name: string;
  description: string;
}

export interface Asset {
  id: number;
  tickerSymbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  gainLoss: number;
  gainLossPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssetRequest {
  tickerSymbol: string;
  quantity: number;
  purchasePrice: number;
}

export interface PortfolioDetails extends Portfolio {
  assets: Asset[];
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: string;
  volume: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
}

export interface StockOverview {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  marketCap: string;
  peRatio: string;
  dividendYield: string;
}

export interface DiversificationScore {
  score: number;
  assetCount: number;
  hhi: number;
  message: string;
}

export interface Recommendation {
  type: string;
  priority: string;
  message: string;
  suggestedAssets: string[];
}

export interface Simulation {
  portfolioId: number;
  simulationDays: number;
  currentValue: number;
  simulatedValue: number;
  totalReturn: number;
  returnPercentage: number;
  dailyReturns: number[];
}

// Auth API
export const authAPI = {
  register: (data: AuthRequest) => api.post('/auth/register', data),
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Portfolio API
export const portfolioAPI = {
  createPortfolio: (data: PortfolioRequest) => api.post('/portfolios', data),
  getUserPortfolios: () => api.get('/portfolios'),
  getPortfolio: (id: number) => api.get(`/portfolios/${id}`),
  addAsset: (portfolioId: number, data: AssetRequest) => api.post(`/portfolios/${portfolioId}/assets`, data),
  removeAsset: (portfolioId: number, assetId: number) => api.delete(`/portfolios/${portfolioId}/assets/${assetId}`),
};

// Stock API
export const stockAPI = {
  getQuote: (symbol: string) => api.get(`/stocks/quote/${symbol}`),
  getOverview: (symbol: string) => api.get(`/stocks/overview/${symbol}`),
  getTimeSeries: (symbol: string) => api.get(`/stocks/timeseries/${symbol}`),
};

// Insights API
export const insightsAPI = {
  getDiversificationScore: (portfolioId: number) => api.get(`/insights/diversification/${portfolioId}`),
  getRecommendations: (portfolioId: number) => api.get(`/insights/recommendations/${portfolioId}`),
  simulatePerformance: (portfolioId: number, days: number = 30) => api.get(`/insights/simulation/${portfolioId}?days=${days}`),
};

export default api;
