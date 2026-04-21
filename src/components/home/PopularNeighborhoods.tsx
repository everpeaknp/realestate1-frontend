import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface Neighborhood {
  id: string;
  name: string;
  image: string;
  gridClass: string;
}

const neighborhoods: Neighborhood[] = [
  {
    id: '1',
    name: 'Westwood',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
    gridClass: 'lg:col-start-1 lg:row-start-1 lg:w-[384px] lg:h-[242px]',
  },
  {
    id: '2',
    name: 'Hyde Park',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800',
    gridClass: 'lg:col-start-1 lg:row-start-2 lg:w-[384px] lg:h-[242px]',
  },
  {
    id: '3',
    name: 'Sunset Square',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800',
    gridClass: 'lg:col-start-2 lg:row-span-2 lg:w-[384px] lg:h-[492px]',
  },
  {
    id: '4',
    name: 'East Village',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800',
    gridClass: 'lg:col-start-3 lg:row-start-1 lg:w-[384px] lg:h-[242px]',
  },
  {
    id: '5',
    name: 'Las Colinas',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800',
    gridClass: 'lg:col-start-3 lg:row-start-2 lg:w-[384px] lg:h-[242px]',
  },
];

export default function PopularNeighborhoods() {
  return (
    <section className="bg-white py-24 pb-32">
      <div className="mx-auto max-w-7xl px-6 text-center">
        {/* Section Header */}
        <div className="mb-16">
          <motion.h2 
            className="text-4xl font-bold text-[#1a1a1a] mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Popular Neighborhoods
          </motion.h2>
          <motion.p 
            className="text-[#7C7A70] max-w-2xl mx-auto text-lg leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            I assist my customers in identifying their fundamental goals for buying or selling 
            property, and I attentively handle the process from beginning to end.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-0.5 gap-y-2">
          {neighborhoods.map((item, index) => (
            <motion.div
              key={item.id}
              className={`relative overflow-hidden group cursor-pointer rounded-sm ${item.gridClass}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Neighborhood Image */}
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-[#c1a478]/40 transition-colors duration-300" />
              
              {/* Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="bg-[#c1a478] p-1.5 rounded-full mb-3 shadow-lg transform group-hover:scale-110 transition-transform">
                  <MapPin size={18} fill="white" className="text-[#c1a478]" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide shadow-black drop-shadow-md">
                  {item.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
