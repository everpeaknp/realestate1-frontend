'use client';

import { useEffect, useState } from 'react';
import { cmsAPI } from '@/lib/api';

export default function TestFaviconPage() {
  const [headerSettings, setHeaderSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await cmsAPI.getHeaderSettings();
        console.log('Header Settings:', data);
        setHeaderSettings(data[0]);
      } catch (err) {
        console.error('Error fetching header settings:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Favicon & Site Name Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Header Settings Data</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(headerSettings, null, 2)}
            </pre>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Favicon & Site Name</h2>
            
            <div className="space-y-4">
              <div>
                <label className="font-medium text-gray-700">Site Name:</label>
                <p className="text-lg mt-1">
                  {headerSettings?.site_name || 'Not set'}
                </p>
              </div>

              <div>
                <label className="font-medium text-gray-700">Favicon URL:</label>
                <p className="text-sm text-gray-600 mt-1 break-all">
                  {headerSettings?.favicon || 'Not set'}
                </p>
              </div>

              {headerSettings?.favicon && (
                <div>
                  <label className="font-medium text-gray-700">Favicon Preview:</label>
                  <div className="mt-2 p-4 bg-gray-100 rounded inline-block">
                    <img 
                      src={headerSettings.favicon} 
                      alt="Favicon" 
                      className="w-16 h-16"
                      onError={(e) => {
                        console.error('Failed to load favicon');
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text y="32" font-size="32">❌</text></svg>';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Current Browser Tab</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Document Title:</span>{' '}
                <span className="text-gray-600">{typeof window !== 'undefined' ? document.title : 'N/A'}</span>
              </p>
              <p>
                <span className="font-medium">Favicon Links:</span>
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                {typeof window !== 'undefined' && 
                  Array.from(document.querySelectorAll('link[rel*="icon"]')).map((link, i) => (
                    <li key={i}>
                      {link.getAttribute('rel')}: {link.getAttribute('href')}
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Go to Django Admin: <a href="http://localhost:8000/admin/cms/headersettings/1/change/" target="_blank" className="text-blue-600 underline">http://localhost:8000/admin/cms/headersettings/1/change/</a></li>
              <li>Upload a favicon in the "Site Favicon & Name" section</li>
              <li>Set a custom site name</li>
              <li>Click Save</li>
              <li>Refresh this page to see the changes</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
