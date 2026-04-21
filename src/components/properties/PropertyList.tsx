'use client';

import { MapPin, Bed, Bath, Car, Maximize, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  garage: number;
  sqft: number;
  image: string;
  type: 'FOR SALE' | 'FOR RENT';
}

const properties: Property[] = [
  {
    id: '1',
    title: 'Merril Willow',
    location: 'Panama City, Florida',
    price: '$1,86,000',
    beds: 3,
    baths: 2,
    garage: 2,
    sqft: 1440,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    type: 'FOR SALE',
  },
  {
    id: '2',
    title: 'Grande Maison',
    location: 'Panama City, Florida',
    price: '$46,000',
    beds: 3,
    baths: 2,
    garage: 2,
    sqft: 1440,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    type: 'FOR RENT',
  },
  {
    id: '3',
    title: 'The Casita',
    location: 'Panama City, Florida',
    price: '$2,32,000',
    beds: 3,
    baths: 2,
    garage: 2,
    sqft: 1440,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
    type: 'FOR SALE',
  },
  {
    id: '4',
    title: 'Creekside Villa',
    location: 'Panama City, Florida',
    price: '$42,000',
    beds: 3,
    baths: 2,
    garage: 2,
    sqft: 1440,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    type: 'FOR RENT',
  },
  // Adding more to fill 12 total (3 rows of 4)
  {
    id: '5',
    title: 'Sunny Apartments',
    location: 'Miami, Florida',
    price: '$3,20,000',
    beds: 2,
    baths: 2,
    garage: 1,
    sqft: 1100,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800',
    type: 'FOR SALE',
  },
  {
    id: '6',
    title: 'Palm Heights',
    location: 'Orlando, Florida',
    price: '$5,50,000',
    beds: 4,
    baths: 3,
    garage: 3,
    sqft: 2800,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800',
    type: 'FOR SALE',
  },
  {
    id: '7',
    title: 'Ocean Breeze',
    location: 'Tampa, Florida',
    price: '$2,90,000',
    beds: 3,
    baths: 2,
    garage: 2,
    sqft: 1650,
    image: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&q=80&w=800',
    type: 'FOR SALE',
  },
  {
    id: '8',
    title: 'Modern Loft',
    location: 'Austin, Texas',
    price: '$35,000',
    beds: 1,
    baths: 1,
    garage: 1,
    sqft: 850,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    type: 'FOR RENT',
  },
  {
    id: '9',
    title: 'Pine Woods',
    location: 'Seattle, Washington',
    price: '$4,10,000',
    beds: 3,
    baths: 2,
    garage: 2,
    sqft: 1900,
    image: 'https://images.unsplash.com/photo-1549517045-bc93de075e53?auto=format&fit=crop&q=80&w=800',
    type: 'FOR SALE',
  },
  {
    id: '10',
    title: 'Desert Mirage',
    location: 'Phoenix, Arizona',
    price: '$28,000',
    beds: 2,
    baths: 1,
    garage: 1,
    sqft: 1050,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    type: 'FOR RENT',
  },
  {
    id: '11',
    title: 'Lakeside Manor',
    location: 'Chicago, Illinois',
    price: '$6,75,000',
    beds: 5,
    baths: 4,
    garage: 3,
    sqft: 3500,
    image: 'https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?auto=format&fit=crop&q=80&w=800',
    type: 'FOR SALE',
  },
  {
    id: '12',
    title: 'Urban Core',
    location: 'Denver, Colorado',
    price: '$4,25,000',
    beds: 2,
    baths: 2,
    garage: 0,
    sqft: 1200,
    image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=800',
    type: 'FOR SALE',
  },
];

export default function PropertyList() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              className="bg-white border border-gray-100 shadow-sm overflow-hidden group flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              {/* Image Section */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                {/* Status Ribbon */}
                <div className="absolute top-0 left-0 overflow-hidden w-28 h-28 z-10">
                   <div className={`absolute top-4 -left-8 w-36 py-1 text-center text-[10px] font-bold tracking-widest text-white shadow-lg transform -rotate-45 ${
                     property.type === 'FOR SALE' ? 'bg-[#5d6d87]' : 'bg-[#5d6d87]/90'
                   }`}>
                     {property.type}
                   </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-1.5 text-[#c1a478] mb-2">
                  <MapPin size={14} fill="currentColor" fillOpacity={0.2} />
                  <span className="text-[13px] font-medium text-gray-500">{property.location}</span>
                </div>
                
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4 group-hover:text-[#c1a478] transition-colors font-sans">
                  {property.title}
                </h3>

                {/* Amenities */}
                <div className="grid grid-cols-4 gap-2 mb-6 border-t border-gray-100 pt-4">
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                       <Bed size={16} />
                       <span className="text-xs font-bold text-gray-800">{property.beds}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                       <Bath size={16} />
                       <span className="text-xs font-bold text-gray-800">{property.baths}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                       <Car size={16} />
                       <span className="text-xs font-bold text-gray-800">{property.garage}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                       <Maximize size={16} />
                       <span className="text-xs font-bold text-gray-800">{property.sqft}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-lg font-bold text-[#c1a478]">{property.price}</span>
                  <a href="#" className="flex items-center gap-1 text-[13px] font-bold text-[#34465d] hover:text-[#c1a478] transition-colors">
                    View Details
                    <ChevronRight size={14} className="mt-0.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
