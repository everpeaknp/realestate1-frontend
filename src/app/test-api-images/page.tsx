/**
 * Test page to debug API image loading
 * Access at: /test-api-images
 */

import { API_ENDPOINTS } from '@/lib/api';

async function getTestData() {
  try {
    // Fetch various API endpoints that return images
    const [heroSettings, neighborhoods, benefitGallery, instagram] = await Promise.allSettled([
      fetch(API_ENDPOINTS.home.heroSettings, { cache: 'no-store' }).then(r => r.json()),
      fetch(API_ENDPOINTS.home.neighborhoods, { cache: 'no-store' }).then(r => r.json()),
      fetch(API_ENDPOINTS.home.benefitGallery, { cache: 'no-store' }).then(r => r.json()),
      fetch(API_ENDPOINTS.home.instagram, { cache: 'no-store' }).then(r => r.json()),
    ]);

    return {
      heroSettings: heroSettings.status === 'fulfilled' ? heroSettings.value : null,
      neighborhoods: neighborhoods.status === 'fulfilled' ? neighborhoods.value : null,
      benefitGallery: benefitGallery.status === 'fulfilled' ? benefitGallery.value : null,
      instagram: instagram.status === 'fulfilled' ? instagram.value : null,
    };
  } catch (error) {
    console.error('Error fetching test data:', error);
    return null;
  }
}

export default async function TestAPIImagesPage() {
  const data = await getTestData();

  if (!data) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">API Image Test - Error</h1>
        <p className="text-red-600">Failed to fetch data from API</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">API Image Loading Test</h1>
      
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Open browser DevTools (F12)</li>
          <li>Go to Console tab to see image loading logs</li>
          <li>Go to Network tab to see failed requests</li>
          <li>Check if image URLs are correct (should be https://bijenkhadka.com.au/media/...)</li>
          <li>Try clicking on image URLs below to test direct access</li>
        </ol>
      </div>

      {/* Hero Settings */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Hero Settings</h2>
        {data.heroSettings?.background_image ? (
          <div className="space-y-2">
            <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded">
              <strong>URL:</strong> <a href={data.heroSettings.background_image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{data.heroSettings.background_image}</a>
            </p>
            <img 
              src={data.heroSettings.background_image} 
              alt="Hero Background" 
              className="max-w-md border border-gray-300"
              onError={(e) => {
                console.error('Hero image failed to load:', data.heroSettings.background_image);
                e.currentTarget.style.border = '2px solid red';
              }}
              onLoad={() => {
                console.log('✅ Hero image loaded successfully:', data.heroSettings.background_image);
              }}
            />
          </div>
        ) : (
          <p className="text-gray-500">No background image</p>
        )}
      </section>

      {/* Neighborhoods */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Neighborhoods</h2>
        {data.neighborhoods?.results?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.neighborhoods.results.slice(0, 6).map((neighborhood: any) => (
              <div key={neighborhood.id} className="border border-gray-300 p-4 rounded">
                <h3 className="font-semibold mb-2">{neighborhood.name}</h3>
                {neighborhood.image ? (
                  <div className="space-y-2">
                    <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded">
                      <a href={neighborhood.image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{neighborhood.image}</a>
                    </p>
                    <img 
                      src={neighborhood.image} 
                      alt={neighborhood.name}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        console.error('Neighborhood image failed:', neighborhood.image);
                        e.currentTarget.style.border = '2px solid red';
                      }}
                      onLoad={() => {
                        console.log('✅ Neighborhood image loaded:', neighborhood.name);
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No image</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No neighborhoods found</p>
        )}
      </section>

      {/* Benefit Gallery */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Benefit Gallery</h2>
        {data.benefitGallery?.results?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {data.benefitGallery.results.slice(0, 8).map((item: any) => (
              <div key={item.id} className="border border-gray-300 p-2 rounded">
                {item.image ? (
                  <div className="space-y-2">
                    <p className="font-mono text-xs break-all bg-gray-100 p-1 rounded">
                      <a href={item.image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{item.image.substring(0, 50)}...</a>
                    </p>
                    <img 
                      src={item.image} 
                      alt={item.alt_text || 'Gallery image'}
                      className="w-full h-24 object-cover"
                      onError={(e) => {
                        console.error('Gallery image failed:', item.image);
                        e.currentTarget.style.border = '2px solid red';
                      }}
                      onLoad={() => {
                        console.log('✅ Gallery image loaded:', item.id);
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No image</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No gallery images found</p>
        )}
      </section>

      {/* Instagram */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Instagram Images</h2>
        {data.instagram?.results?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {data.instagram.results.slice(0, 8).map((item: any) => (
              <div key={item.id} className="border border-gray-300 p-2 rounded">
                {item.image ? (
                  <div className="space-y-2">
                    <p className="font-mono text-xs break-all bg-gray-100 p-1 rounded">
                      <a href={item.image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{item.image.substring(0, 50)}...</a>
                    </p>
                    <img 
                      src={item.image} 
                      alt={item.alt_text || 'Instagram image'}
                      className="w-full h-24 object-cover"
                      onError={(e) => {
                        console.error('Instagram image failed:', item.image);
                        e.currentTarget.style.border = '2px solid red';
                      }}
                      onLoad={() => {
                        console.log('✅ Instagram image loaded:', item.id);
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No image</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No Instagram images found</p>
        )}
      </section>

      {/* API Response Debug */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Raw API Responses</h2>
        <details className="bg-gray-100 p-4 rounded">
          <summary className="cursor-pointer font-semibold">Click to view raw JSON</summary>
          <pre className="mt-4 text-xs overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </section>
    </div>
  );
}
