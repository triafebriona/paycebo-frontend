import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WebhookLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(null);
  const [expandedLog, setExpandedLog] = useState(null);
  
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/webhook-logs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setLogs(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load webhook logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLogs();
  }, []);
  
  const handleRetry = async (logId) => {
    try {
      setRetrying(logId);
      const token = localStorage.getItem('token');
      
      await axios.post(`http://localhost:5000/api/webhook-logs/${logId}/retry`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      fetchLogs();
    } catch (err) {
      setError('Failed to retry webhook');
      console.error(err);
    } finally {
      setRetrying(null);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const formatJson = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return jsonString || 'No data';
    }
  };
  
  const toggleExpand = (id) => {
    if (expandedLog === id) {
      setExpandedLog(null);
    } else {
      setExpandedLog(id);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Webhook Logs</h2>
        <button
          onClick={fetchLogs}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Refresh
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading webhook logs...</p>
        </div>
      ) : (
        <>
          {logs.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No webhook logs</h3>
              <p className="mt-1 text-sm text-gray-500">No webhook notifications have been sent yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retry</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <React.Fragment key={log.id}>
                      <tr className={expandedLog === log.id ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(log.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{log.payment_id.substring(0, 8)}...</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {log.success ? 'Success' : 'Failed'} {log.status_code ? `(${log.status_code})` : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{log.url}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.retry_count > 0 ? `Retry #${log.retry_count}` : 'Original'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleExpand(log.id)}
                            className="text-primary-600 hover:text-primary-900 mr-3"
                          >
                            {expandedLog === log.id ? 'Hide' : 'Details'}
                          </button>
                          {!log.success && (
                            <button
                              onClick={() => handleRetry(log.id)}
                              disabled={retrying === log.id}
                              className={`text-primary-600 hover:text-primary-900 ${retrying === log.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {retrying === log.id ? 'Retrying...' : 'Retry'}
                            </button>
                          )}
                        </td>
                      </tr>
                      {expandedLog === log.id && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Request Payload</h4>
                                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                                  {formatJson(log.request_body)}
                                </pre>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Response</h4>
                                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                                  {log.response_body ? formatJson(log.response_body) : 'No response'}
                                </pre>
                                {log.error_message && (
                                  <div className="mt-2">
                                    <h4 className="text-sm font-medium text-red-700 mb-1">Error</h4>
                                    <p className="text-sm text-red-600">{log.error_message}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">About Webhooks</h3>
            <p className="text-sm text-gray-600 mb-2">
              Webhooks allow your server to receive real-time notifications about payment events. 
              Each log entry represents an attempt to notify your webhook URL about a payment status change.
            </p>
            <p className="text-sm text-gray-600">
              If a webhook delivery fails, you can manually retry it using the "Retry" button.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default WebhookLogs;