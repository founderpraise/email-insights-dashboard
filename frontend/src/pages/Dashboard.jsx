import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMail, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import UploadForm from '../components/UploadForm';
import TopSendersChart from '../components/TopSendersChart';
import WordFrequencyChart from '../components/WordFrequencyChart';
import EmailTimelineChart from '../components/EmailTimelineChart';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailCount, setEmailCount] = useState(0);
  const [groupBy, setGroupBy] = useState('daily');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:8000/analytics?group_by=${groupBy}`);
      setAnalytics(response.data);
      
      // Calculate total email count
      const totalEmails = response.data.top_senders.reduce((sum, sender) => sum + sender.count, 0);
      setEmailCount(totalEmails);
    } catch (err) {
      setError('Failed to fetch analytics data. Please make sure the backend server is running.');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    // Refresh analytics after successful upload
    fetchAnalytics();
  };

  const handleGroupByChange = (newGroupBy) => {
    setGroupBy(newGroupBy);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [groupBy]);

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FiMail className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Email Insights Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Group by:</span>
                <select
                  value={groupBy}
                  onChange={(e) => handleGroupByChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <button
                onClick={fetchAnalytics}
                disabled={loading}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <FiRefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Email Summary</h2>
                <p className="text-sm text-gray-600">Total emails processed</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{emailCount}</div>
                <div className="text-sm text-gray-500">emails</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="mb-8">
          <UploadForm onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Senders Chart */}
          <div>
            <TopSendersChart data={analytics?.top_senders || []} />
          </div>

          {/* Word Frequency Chart */}
          <div>
            <WordFrequencyChart data={analytics?.most_common_words || []} />
          </div>

          {/* Email Timeline Chart - Full Width */}
          <div className="lg:col-span-2">
            <EmailTimelineChart 
              data={analytics?.email_count_over_time || {}} 
              groupBy={groupBy}
            />
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <FiRefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
              <span className="text-gray-700">Updating analytics...</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 