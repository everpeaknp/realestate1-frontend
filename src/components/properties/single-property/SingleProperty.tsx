'use client';

import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Calendar } from 'lucide-react';

interface SinglePropertyProps {
  slug: string;
}

export default function SingleProperty({ slug }: SinglePropertyProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <MapPin className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold">Property Details</h1>
          </div>
          <p className="text-lg text-gray-600">Property ID: {slug}</p>
        </div>

        {/* Property Image Gallery Placeholder */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-500">Property Image Gallery</p>
          </div>
        </div>

        {/* Property Info Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Main Info */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-semibold">3</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-semibold">2</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-semibold">2,500 sqft</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Year Built</p>
                    <p className="font-semibold">2020</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                This is a placeholder description for the property. In a real application, 
                this would contain detailed information about the property, its features, 
                location, and amenities.
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Features & Amenities</h3>
              <ul className="grid md:grid-cols-2 gap-3">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>Air Conditioning</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>Parking</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>Garden</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>Security System</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="mb-6">
                <p className="text-3xl font-bold text-green-600 mb-2">$450,000</p>
                <p className="text-sm text-gray-500">For Sale</p>
              </div>

              <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-3">
                Schedule Viewing
              </button>
              
              <button className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Contact Agent
              </button>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3">Agent Information</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-sm text-gray-500">Real Estate Agent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Map Placeholder */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Location</h3>
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-500">Map View</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
