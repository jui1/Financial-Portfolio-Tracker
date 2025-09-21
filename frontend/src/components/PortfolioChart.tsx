import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { PortfolioDetails } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PortfolioChartProps {
  portfolio: PortfolioDetails;
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ portfolio }) => {
  const data = {
    labels: portfolio.assets.map(asset => asset.tickerSymbol),
    datasets: [
      {
        data: portfolio.assets.map(asset => asset.totalValue),
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green
          '#F59E0B', // Yellow
          '#EF4444', // Red
          '#8B5CF6', // Purple
          '#06B6D4', // Cyan
          '#84CC16', // Lime
          '#F97316', // Orange
          '#EC4899', // Pink
          '#6B7280', // Gray
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (portfolio.assets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>No assets to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PortfolioChart;
