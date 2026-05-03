'use client';

import { useState, useEffect } from 'react';

export default function ApiTestPage() {
  const [apiUrl, setApiUrl] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    setApiUrl(url);
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const response = await fetch(`${apiUrl}/api/blog/posts/`, {
        cache: 'no-store',
      });

      const data = await response.json();

      setTestResult({
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: {
          'content-type': response.headers.get('content-type'),
          'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        },
        data: data,
        dataType: Array.isArray(data) ? 'array' : typeof data,
        dataLength: Array.isArray(data) ? data.length : 'N/A',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Blog API Connection Test
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuration</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>API URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{apiUrl}</code>
            </p>
            <p className="text-gray-700">
              <strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{apiUrl}/api/blog/posts/</code>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
            <div className="mt-4 text-sm text-red-600">
              <p><strong>Possible causes:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Django backend is not running</li>
                <li>CORS is not configured</li>
                <li>Wrong API URL</li>
                <li>Network/firewall blocking the connection</li>
              </ul>
            </div>
          </div>
        )}

        {testResult && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Test Results</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-700 mb-2">Response Status</h4>
                <div className={`inline-block px-4 py-2 rounded ${testResult.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {testResult.status} {testResult.statusText}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 mb-2">Headers</h4>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                  {JSON.stringify(testResult.headers, null, 2)}
                </pre>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 mb-2">Data Type</h4>
                <div className={`inline-block px-4 py-2 rounded ${testResult.dataType === 'array' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {testResult.dataType}
                  {testResult.dataType === 'array' && ` (${testResult.dataLength} items)`}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 mb-2">Response Data</h4>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm max-h-96">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>

              {testResult.dataType !== 'array' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <p className="text-yellow-800 font-semibold">⚠️ Warning</p>
                  <p className="text-yellow-700 mt-2">
                    The API returned a <strong>{testResult.dataType}</strong> instead of an array.
                    This will cause the blog page to fail.
                  </p>
                </div>
              )}

              {testResult.dataType === 'array' && testResult.dataLength === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <p className="text-blue-800 font-semibold">ℹ️ Info</p>
                  <p className="text-blue-700 mt-2">
                    The API is working but returned an empty array. You need to create blog posts in Django Admin.
                  </p>
                </div>
              )}

              {testResult.dataType === 'array' && testResult.dataLength > 0 && (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <p className="text-green-800 font-semibold">✅ Success</p>
                  <p className="text-green-700 mt-2">
                    The API is working correctly and returned {testResult.dataLength} blog post(s).
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Troubleshooting Steps</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Make sure Django backend is running: <code className="bg-white px-2 py-1 rounded">python manage.py runserver</code></li>
            <li>Test the API directly in browser: <a href={`${apiUrl}/api/blog/posts/`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{apiUrl}/api/blog/posts/</a></li>
            <li>Check CORS configuration in Django settings.py</li>
            <li>Create blog posts in Django Admin if the array is empty</li>
            <li>Check browser console for detailed error messages</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
