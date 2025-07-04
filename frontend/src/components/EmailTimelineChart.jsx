import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FiCalendar } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EmailTimelineChart = ({ data, groupBy = 'daily' }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <FiCalendar className="w-6 h-6 text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Email Timeline</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <FiCalendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No timeline data available</p>
          <p className="text-sm">Upload some emails to see timeline statistics</p>
        </div>
      </div>
    );
  }

  // Sort dates chronologically
  const sortedDates = Object.keys(data).sort();
  const sortedCounts = sortedDates.map(date => data[date]);

  const chartData = {
    labels: sortedDates.map(date => {
      // Format date for display
      const dateObj = new Date(date);
      if (groupBy === 'weekly') {
        return `Week of ${dateObj.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })}`;
      }
      return dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }),
    datasets: [
      {
        label: 'Email Count',
        data: sortedCounts,
        borderColor: 'rgba(147, 51, 234, 1)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(147, 51, 234, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
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
            const index = context[0].dataIndex;
            const date = sortedDates[index];
            const dateObj = new Date(date);
            return dateObj.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
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
          text: groupBy === 'weekly' ? 'Week' : 'Date',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FiCalendar className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Email Timeline</h2>
          </div>
        <div className="text-sm text-gray-600">
          Grouped by: {groupBy === 'weekly' ? 'Week' : 'Day'}
        </div>
      </div>
      
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Showing email count over time ({sortedDates.length} data points)</p>
      </div>
    </div>
  );
};

export default EmailTimelineChart; 