import { motion } from 'framer-motion';

// Custom Instagram Icon Component
const InstagramIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const instagramImages = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
];

export default function InstagramGallery() {
  return (
    <section className="bg-white py-12 pb-0 overflow-hidden">
      {/* Feed Header */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <InstagramIcon size={20} className="text-[#5d6d87]" />
        <h2 className="text-[13px] font-bold tracking-[0.2em] text-[#5d6d87] uppercase">
          Follow us on Instagram
        </h2>
      </div>

      {/* Grid of Images */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {instagramImages.map((img, index) => (
            <motion.a
              key={index}
              href="#"
              className="w-[160px] h-[160px] overflow-hidden relative group block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <img 
                src={img} 
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#c1a478]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <InstagramIcon size={24} className="text-white" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
