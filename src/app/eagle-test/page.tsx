'use client';

import { useState } from 'react';

export default function EagleTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/eagle/test-auth');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/eagle/properties?limit=5');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Eagle API Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Authentication</h2>
          <p className="text-gray-600 mb-4">
            This will test different authentication methods with the Eagle API.
          </p>
          <button
            onClick={testAuth}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Authentication'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Properties Endpoint</h2>
          <p className="text-gray-600 mb-4">
            This will attempt to fetch properties from the Eagle API.
          </p>
          <button
            onClick={testProperties}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Properties'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <div className="bg-gray-100 p-4 rounded overflow-auto">
              <pre className="text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
            
            {result.success === false && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <h3 className="font-semibold text-red-800 mb-2">Error Detected</h3>
                <p className="text-red-700 text-sm">
                  {result.error || 'Unknown error occurred'}
                </p>
                {result.attempts && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-red-800 mb-2">Authentication Attempts:</h4>
                    {result.attempts.map((attempt: any, index: number) => (
                      <div key={index} className="mb-2 p-2 bg-white rounded">
                        <p className="font-medium">{attempt.method}</p>
                        <p className="text-sm">Status: {attempt.status}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Response: {JSON.stringify(attempt.response).substring(0, 100)}...
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {result.success === true && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <h3 className="font-semibold text-green-800 mb-2">✓ Success!</h3>
                {result.method && (
                  <p className="text-green-700 text-sm">
                    Authentication method: <strong>{result.method}</strong>
                  </p>
                )}
                {result.tokenFound !== undefined && (
                  <p className="text-green-700 text-sm">
                    Token found: <strong>{result.tokenFound ? 'Yes' : 'No'}</strong>
                  </p>
                )}
                {result.count !== undefined && (
                  <p className="text-green-700 text-sm">
                    Properties fetched: <strong>{result.count}</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">Troubleshooting Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Check that your .env.local file has EAGLE_CLIENT_ID and EAGLE_CLIENT_SECRET</li>
            <li>• Restart your dev server after changing environment variables</li>
            <li>• Check the browser console and terminal for detailed error messages</li>
            <li>• See doc/EAGLE_TROUBLESHOOTING.md for more help</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
