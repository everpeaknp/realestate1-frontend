import { MapPin, Bed, Bath, Car, Maximize, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  description?: string;
  image: string;
  status: 'FOR SALE' | 'FOR RENT';
  beds: number;
  baths: number;
  cars: number;
  sqft: number;
}

const properties: Property[] = [
  {
    id: '1',
    title: 'Harmony Place',
    location: 'Panama City, Florida',
    price: '$3,86,000',
    description: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet dapibus ac facilisis in egestas eget quam.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
    status: 'FOR SALE',
    beds: 4,
    baths: 3,
    cars: 2,
    sqft: 1440,
  },
  {
    id: '2',
    title: 'The Comfort Court',
    location: 'Panama City, Florida',
    price: '$76,000',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=800',
    status: 'FOR RENT',
    beds: 3,
    baths: 2,
    cars: 2,
    sqft: 1440,
  },
  {
    id: '3',
    title: 'United Units',
    location: 'Panama City, Florida',
    price: '$2,54,000',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=800',
    status: 'FOR SALE',
    beds: 3,
    baths: 2,
    cars: 2,
    sqft: 1440,
  },
  {
    id: '4',
    title: 'Sunset Springs',
    location: 'Panama City, Florida',
    price: '$56,000',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
    status: 'FOR RENT',
    beds: 3,
    baths: 2,
    cars: 2,
    sqft: 1440,
  },
];

function StatusRibbon({ status }: { status: string }) {
  return (
    <div className="absolute top-4 left-[-35px] z-10 w-[140px] h-8 bg-[#5d6d87]/90 flex items-center justify-center -rotate-45 shadow-md">
      <span className="text-white text-[10px] font-bold tracking-widest">{status}</span>
    </div>
  );
}

export default function FeaturedProperties() {
  const mainProperty = properties[0];
  const sideProperties = properties.slice(1);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16 px-4">
          <motion.h2 
            className="text-4xl font-bold text-[#1a1a1a] mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Featured Properties
          </motion.h2>
          <motion.p 
            className="text-[#7C7A70] max-w-3xl mx-auto text-lg leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Look no further than the highlighted, magnificent home for your next stay. The 
            surrounding area is charming, sophisticated, and visually stunning.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Large Card */}
          <motion.div 
            className="lg:col-span-7 bg-[#FFFAF3] shadow-sm flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[480px] overflow-hidden group">
              <StatusRibbon status={mainProperty.status} />
              <img 
                src={mainProperty.image} 
                alt={mainProperty.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Stats Overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-[#34465d]/90 py-4 px-8 flex items-center justify-center gap-10 text-white text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Bed size={18} className="opacity-70" />
                  <span>{mainProperty.beds}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath size={18} className="opacity-70" />
                  <span>{mainProperty.baths}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car size={18} className="opacity-70" />
                  <span>{mainProperty.cars}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize size={18} className="opacity-70" />
                  <span>{mainProperty.sqft}</span>
                </div>
              </div>
            </div>
            
            <div className="p-10 flex-1 flex flex-col items-start">
              <div className="flex items-center gap-2 text-[#c1a478] mb-3">
                <MapPin size={16} fill="currentColor" fillOpacity={0.2} />
                <span className="text-[14px] font-medium text-[#7C7A70]">{mainProperty.location}</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-5">{mainProperty.title}</h3>
              <p className="text-[#7C7A70] text-sm leading-relaxed mb-8 max-w-lg">
                {mainProperty.description}
              </p>
              
              <div className="mt-auto flex items-center justify-between w-full border-t border-gray-200 pt-8">
                <span className="text-2xl font-bold text-[#c1a478]">{mainProperty.price}</span>
                <a href="#" className="flex items-center gap-1 text-[12px] font-bold tracking-widest text-[#1a1a1a] hover:text-[#c1a478] transition-colors uppercase">
                  View Details <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Side List Cards */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {sideProperties.map((prop, index) => (
              <motion.div 
                key={prop.id}
                className="bg-[#FFFAF3] shadow-sm grid grid-cols-1 md:grid-cols-5 overflow-hidden"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="relative md:col-span-2 h-44 md:h-full overflow-hidden group">
                  <StatusRibbon status={prop.status} />
                  <img 
                    src={prop.image} 
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="md:col-span-3 p-8 flex flex-col items-start gap-3">
                  <div className="flex items-center gap-2 text-[#c1a478]">
                    <MapPin size={14} fill="currentColor" fillOpacity={0.2} />
                    <span className="text-[12px] font-medium text-[#7C7A70]">{prop.location}</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#1a1a1a]">{prop.title}</h4>
                  
                  <div className="flex items-center gap-5 text-[#7C7A70] text-xs font-semibold py-2">
                    <div className="flex items-center gap-1.5">
                      <Bed size={14} className="opacity-60" />
                      <span>{prop.beds}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath size={14} className="opacity-60" />
                      <span>{prop.baths}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Car size={14} className="opacity-60" />
                      <span>{prop.cars}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize size={14} className="opacity-60" />
                      <span>{prop.sqft}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-100">
                    <span className="font-bold text-[#c1a478]">{prop.price}</span>
                    <a href="#" className="flex items-center gap-0.5 text-[10px] font-bold tracking-widest text-[#1a1a1a] hover:text-[#c1a478] transition-colors uppercase">
                      View Details <ChevronRight size={12} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
