import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiEye, 
  FiClock, 
  FiTrendingUp, 
  FiSmartphone, 
  FiMonitor,
  FiGlobe,
  FiMapPin,
  FiActivity,
  FiList
} from 'react-icons/fi';

const VisitorAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('7d');
  const [realtimeData, setRealtimeData] = useState(null);
  const [recentVisits, setRecentVisits] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState('');

  const token = localStorage.getItem('userToken');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/visitors/analytics?period=${period}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAnalytics(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/visitors/realtime`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setRealtimeData(response.data);
    } catch (err) {
      console.error('Failed to fetch real-time data:', err);
    }
  };

  const fetchRecentVisits = async () => {
    setRecentLoading(true);
    setRecentError('');
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/visitors/recent`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setRecentVisits(response.data);
      setShowRecent(true);
    } catch (err) {
      setRecentError('Failed to fetch recent visits');
    } finally {
      setRecentLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  useEffect(() => {
    // Fetch real-time data every 30 seconds
    fetchRealtimeData();
    const interval = setInterval(fetchRealtimeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    // Handle edge cases
    if (!seconds || isNaN(seconds) || seconds < 0) {
      return '0s';
    }
    
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={fetchAnalytics}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header with period selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Visitor Analytics</h2>
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/visitors/list"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiList className="h-4 w-4" />
              <span>View All Visitors</span>
            </Link>
            
            <button
              onClick={async () => {
                if (window.confirm('This will remove ALL visitor data. Are you sure you want to continue?')) {
                  try {
                    const response = await axios.delete(
                      `${import.meta.env.VITE_BACKEND_URL}/api/visitors/cleanup-all`,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    alert(`Removed ${response.data.deletedCount} visitor records. All data cleared!`);
                    fetchAnalytics(); // Refresh the analytics
                  } catch (err) {
                    alert('Failed to cleanup data: ' + err.message);
                  }
                }
              }}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              <FiActivity className="h-4 w-4" />
              <span>Clear All Data</span>
            </button>

            {/* Real-time indicator */}
            {realtimeData && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{realtimeData.activeVisitors} active now</span>
              </div>
            )}
            {/* Period selector */}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <FiUsers className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Total Visits</p>
                <p className="text-2xl font-bold text-blue-900">{formatNumber(analytics.stats.totalVisits)}</p>
                <p className="text-xs text-blue-700">{formatNumber(analytics.stats.totalPageViews)} page views</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <FiEye className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Unique Visitors</p>
                <p className="text-2xl font-bold text-green-900">{formatNumber(analytics.stats.uniqueVisitors)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <FiClock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Avg Time on Site</p>
                <p className="text-2xl font-bold text-purple-900">{formatTime(analytics.stats.avgTimeOnSite)}</p>
              </div>
            </div>
          </div>
          

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Analytics */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
          </div>
          <div className="p-6">
            {analytics.pageAnalytics.length > 0 ? (
              <div className="space-y-4">
                {analytics.pageAnalytics.slice(0, 5).map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">{page.page}</p>
                      <p className="text-sm text-gray-600">
                        {formatNumber(page.uniqueVisitors)} unique visitors
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-blue-600">{formatNumber(page.visits)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No page data available</p>
            )}
          </div>
        </div>

        {/* Device Analytics */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Device Usage</h3>
          </div>
          <div className="p-6">
            {analytics.deviceAnalytics.length > 0 ? (
              <div className="space-y-4">
                {analytics.deviceAnalytics.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center">
                      {device.device === 'mobile' ? (
                        <FiSmartphone className="h-5 w-5 text-blue-600 mr-3" />
                      ) : device.device === 'tablet' ? (
                        <FiMonitor className="h-5 w-5 text-green-600 mr-3" />
                      ) : (
                        <FiMonitor className="h-5 w-5 text-purple-600 mr-3" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{device.device}</p>
                        <p className="text-sm text-gray-600">
                          {formatNumber(device.uniqueVisitors)} unique visitors
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatNumber(device.visits)}</p>
                      <p className="text-sm text-gray-600">
                        {((device.visits / analytics.stats.totalVisits) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No device data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Country Analytics */}
      {analytics.countryAnalytics.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Countries</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.countryAnalytics.map((country, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <FiGlobe className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{country.country}</p>
                      <p className="text-sm text-gray-600">
                        {formatNumber(country.uniqueVisitors)} unique visitors
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatNumber(country.visits)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Visits */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Visits</h3>
          <button
            onClick={fetchRecentVisits}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Show Recent Visits
          </button>
        </div>
        {recentLoading && <div className="text-center py-4">Loading...</div>}
        {recentError && <div className="text-center text-red-500 py-4">{recentError}</div>}
        {showRecent && recentVisits.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentVisits.map((visit, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <FiUsers className="h-4 w-4 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {visit.userId ? visit.userId.name : 'Guest'}
                          </div>
                          <div className="text-sm text-gray-500">{visit.ip}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visit.page}</div>
                      <div className="text-sm text-gray-500">{visit.pageTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {visit.device === 'mobile' ? (
                          <FiSmartphone className="h-4 w-4 text-blue-600 mr-2" />
                        ) : visit.device === 'tablet' ? (
                          <FiMonitor className="h-4 w-4 text-green-600 mr-2" />
                        ) : (
                          <FiMonitor className="h-4 w-4 text-purple-600 mr-2" />
                        )}
                        <span className="text-sm text-gray-900 capitalize">{visit.device}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(visit.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        visit.converted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {visit.converted ? 'Converted' : 'Engaged'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showRecent && !recentLoading && recentVisits.length === 0 && (
          <p className="text-gray-500 text-center py-4">No recent visits</p>
        )}
      </div>
    </div>
  );
};

export default VisitorAnalytics; 