/**
 * Simple script to test API connection
 * Run with: node test-api-connection.js
 */

const API_URL = 'http://localhost:8000';

async function testConnection() {
  console.log('Testing API connection to:', API_URL);
  console.log('---');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_URL}/api/chatbot/health/`);
    console.log('   Status:', healthResponse.status);
    console.log('   OK:', healthResponse.ok);
    
    // Test 2: Properties list
    console.log('\n2. Testing properties list...');
    const listResponse = await fetch(`${API_URL}/api/properties/`);
    console.log('   Status:', listResponse.status);
    console.log('   OK:', listResponse.ok);
    if (listResponse.ok) {
      const data = await listResponse.json();
      console.log('   Properties count:', data.results?.length || data.length);
      if (data.results && data.results.length > 0) {
        console.log('   First property slug:', data.results[0].slug);
      }
    }
    
    // Test 3: Single property
    console.log('\n3. Testing single property...');
    const propertyResponse = await fetch(`${API_URL}/api/properties/spacious-ranch-style-home/`);
    console.log('   Status:', propertyResponse.status);
    console.log('   OK:', propertyResponse.ok);
    if (propertyResponse.ok) {
      const property = await propertyResponse.json();
      console.log('   Property title:', property.title);
      console.log('   Property slug:', property.slug);
    } else {
      const text = await propertyResponse.text();
      console.log('   Error:', text);
    }
    
    console.log('\n✅ API connection test complete');
  } catch (error) {
    console.error('\n❌ Error testing API:', error.message);
    console.error('   Make sure the Django backend is running on port 8000');
  }
}

testConnection();
