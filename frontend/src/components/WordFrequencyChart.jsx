import React from 'react';
import { FiHash } from 'react-icons/fi';

const WordFrequencyChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <FiHash className="w-6 h-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Most Common Words</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <FiHash className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No word data available</p>
          <p className="text-sm">Upload some emails to see word frequency</p>
        </div>
      </div>
    );
  }

  // Calculate font sizes based on word frequency
  const maxCount = Math.max(...data.map(item => item.count));
  const minCount = Math.min(...data.map(item => item.count));
  
  const getFontSize = (count) => {
    const normalized = (count - minCount) / (maxCount - minCount);
    return Math.max(12, 12 + normalized * 20); // Font size between 12px and 32px
  };

  const getColor = (count) => {
    const normalized = (count - minCount) / (maxCount - minCount);
    if (normalized > 0.8) return 'text-red-600';
    if (normalized > 0.6) return 'text-orange-600';
    if (normalized > 0.4) return 'text-yellow-600';
    if (normalized > 0.2) return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FiHash className="w-6 h-6 text-green-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Most Common Words</h2>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {data.slice(0, 20).map((item, index) => (
          <span
            key={index}
            className={`inline-block px-3 py-1 rounded-full font-medium transition-all hover:scale-105 cursor-pointer ${getColor(item.count)}`}
            style={{
              fontSize: `${getFontSize(item.count)}px`,
              backgroundColor: `${getColor(item.count).replace('text-', 'bg-').replace('-600', '-100')}`,
            }}
            title={`"${item.word}" appears ${item.count} times`}
          >
            {item.word} ({item.count})
          </span>
        ))}
      </div>
      
      <div className="text-sm text-gray-600">
        <p>Showing top {Math.min(20, data.length)} most frequent words</p>
        <p className="text-xs mt-1">
          Word size and color indicate frequency (larger/redder = more frequent)
        </p>
      </div>
    </div>
  );
};

export default WordFrequencyChart; 