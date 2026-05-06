'use client';

import { useState, useEffect } from 'react';

export default function TestImagesPage() {
  const [heroSettings, setHeroSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/home/hero-settings/')
      .then(res => res.json())
      .then(data => {
        console.log('Hero settings:', data);
        setHeroSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching hero settings:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Image Loading Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Hero Settings Data:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(heroSettings, null, 2)}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test 1: Direct img tag with backend URL</h2>
        <img 
          src={heroSettings?.background_image} 
          alt="Hero Background"
          className="max-w-2xl border-2 border-gray-300"
          onLoad={() => console.log('✓ Image loaded successfully')}
          onError={(e) => console.error('✗ Image failed to load', e)}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test 2: Direct img tag with hardcoded URL</h2>
        <img 
          src="http://localhost:8000/media/home/hero/pexels-nevtug-491138436-16404018.jpg"
          alt="Hero Background Hardcoded"
          className="max-w-2xl border-2 border-gray-300"
          onLoad={() => console.log('✓ Hardcoded image loaded successfully')}
          onError={(e) => console.error('✗ Hardcoded image failed to load', e)}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test 3: External image (Unsplash)</h2>
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
          alt="External Image"
          className="max-w-2xl border-2 border-gray-300"
          onLoad={() => console.log('✓ External image loaded successfully')}
          onError={(e) => console.error('✗ External image failed to load', e)}
        />
      </div>
    </div>
  );
}
