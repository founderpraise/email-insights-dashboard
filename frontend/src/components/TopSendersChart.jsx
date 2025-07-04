import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FiUsers } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TopSendersChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <FiUsers className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Top Senders</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <FiUsers className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No email data available</p>
          <p className="text-sm">Upload some emails to see sender statistics</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => {
      // Truncate long email addresses for better display
      const email = item.sender;
      return email.length > 25 ? email.substring(0, 25) + '...' : email;
    }),
    datasets: [
      {
        label: 'Number of Emails',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            // Show full email address in tooltip
            const index = context[0].dataIndex;
            return data[index].sender;
          },
          label: function(context) {
            return `Emails: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        title: {
          display: true,
          text: 'Number of Emails',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Sender Email',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FiUsers className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Top Senders</h2>
      </div>
      
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Showing top {data.length} senders by email count</p>
      </div>
    </div>
  );
};

export default TopSendersChart; 