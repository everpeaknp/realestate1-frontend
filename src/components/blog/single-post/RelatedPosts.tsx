'use client';

import { motion } from 'framer-motion';
const relatedPosts = [
  {
    id: 1,
    title: "How to create your ultimate outdoor kitchen",
    author: "Hocud",
    date: "October 10, 2022",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    title: "Easy DIY projects to improve your home",
    author: "Hocud",
    date: "October 10, 2022",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    title: "Spring cleaning 101: make it fast and effective",
    author: "Hocud",
    date: "October 10, 2022",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    title: "Tips for achieving maximum coziness",
    author: "Hocud",
    date: "October 10, 2022",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600"
  }
];

export default function RelatedPosts() {
  return (
    <section className="bg-[#FFFAF3] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] text-center mb-12 font-sans">
          Related Posts
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedPosts.map((post, idx) => (
            <motion.div 
              key={post.id}
              className="flex flex-col group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              {/* Image Container */}
              <div className="aspect-[4/3] overflow-hidden rounded-sm mb-4 shadow-sm">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Content */}
              <div className="text-center px-1">
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 group-hover:text-[#c1a478] transition-colors leading-tight font-sans">
                  {post.title}
                </h3>
                <div className="text-[#5d6d87] text-[13px] font-bold tracking-tight uppercase">
                  <span>{post.author}</span>
                  <span className="mx-2 text-gray-300">/</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
