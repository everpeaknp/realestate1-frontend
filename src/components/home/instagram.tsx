import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <Camera size={20} className="text-[#5d6d87]" />
        <h2 className="text-[13px] font-bold tracking-[0.2em] text-[#5d6d87] uppercase">
          Follow us on Instagram
        </h2>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-0">
        {instagramImages.map((img, index) => (
          <motion.a
            key={index}
            href="#"
            className="aspect-square overflow-hidden relative group block"
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
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Camera size={24} className="text-white" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
