'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const posts = [
  {
    id: 1,
    title: "Personalize your space with a gallery wall",
    slug: "personalize-your-space-with-gallery-wall",
    author: "Hocud",
    date: "October 10, 2022",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Which amenities are worth the most",
    slug: "which-amenities-are-worth-the-most",
    author: "Hocud",
    date: "October 10, 2022",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Tips for first-time home buyers in the city",
    slug: "tips-for-first-time-home-buyers",
    author: "Hocud",
    date: "October 12, 2022",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "How to stage your home for a quick sale",
    slug: "how-to-stage-your-home-for-quick-sale",
    author: "Hocud",
    date: "October 15, 2022",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "The best neighborhoods for young professionals",
    slug: "best-neighborhoods-for-young-professionals",
    author: "Hocud",
    date: "October 18, 2022",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "Smart home technology that adds value",
    slug: "smart-home-technology-that-adds-value",
    author: "Hocud",
    date: "October 20, 2022",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 7,
    title: "Sustainable living: eco-friendly housing",
    slug: "sustainable-living-eco-friendly-housing",
    author: "Hocud",
    date: "October 22, 2022",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 8,
    title: "Investing in real estate: a beginner's guide",
    slug: "investing-in-real-estate-beginners-guide",
    author: "Hocud",
    date: "October 25, 2022",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800"
  }
];

export default function BlogSection() {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
        {posts.map((post, index) => (
          <Link href={`/blog/${post.slug}`} key={post.id}>
            <motion.div 
              className="flex flex-col group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="aspect-[16/10] overflow-hidden rounded-sm mb-4">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-4 group-hover:text-[#c1a478] transition-colors leading-tight font-sans">
                  {post.title}
                </h3>
                <div className="text-[#5d6d87] text-[15px] font-medium font-sans">
                  <span>{post.author}</span>
                  <span className="mx-2 text-gray-300">/</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-20 flex items-center justify-center gap-6 text-[13px] font-bold tracking-[0.2em] uppercase">
        <button className="flex items-center gap-2 text-gray-400 hover:text-[#1a1a1a] transition-colors">
          « PREVIOUS
        </button>
        <div className="flex items-center gap-4">
          <span className="text-[#c1a478]">1</span>
          <button className="text-[#1a1a1a] hover:text-[#c1a478] transition-colors">2</button>
        </div>
        <button className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#c1a478] transition-colors">
          NEXT »
        </button>
      </div>
    </section>
  );
}
