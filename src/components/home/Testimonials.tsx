import { Play, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: '1',
    type: 'video',
    title: 'Video testimonials from our happy clients',
    name: 'Alison Bond',
    role: 'Happy Buyer',
    image: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    type: 'text',
    title: 'Brilliant Service',
    text: 'Justin is really brilliant. He assisted me in finding the perfect apartment. I also acquired the apartment for less than the market rate!',
    name: 'Bella Miller',
    role: 'Happy Seller',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '3',
    type: 'text',
    title: 'Very Skilled Agent',
    text: "Justin was the most skilled realtor I've ever worked with. I would certainly refer him to anybody seeking an excellent solution.",
    name: 'Colin Butler',
    role: 'Happy Buyer',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=600',
  },
];

function StarRating() {
  return (
    <div className="flex items-center justify-center gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className="text-[#c1a478]" fill="currentColor" stroke="none" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-[#ece6d9] py-24 pb-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 text-center">
        {/* Section Header */}
        <div className="mb-20">
          <motion.h2 
            className="text-4xl font-bold text-[#1a1a1a] mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Testimonials
          </motion.h2>
          <motion.p 
            className="text-[#7C7A70] max-w-3xl mx-auto text-lg leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            I assist my customers in getting to the heart of their real estate demands, desires, 
            and outcomes. I'm in this for the long term.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Video Testimonial Column (5/12) */}
          <motion.div 
            className="lg:col-span-5 relative group cursor-pointer overflow-hidden rounded-sm h-[600px] shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src={testimonials[0].image} 
              alt="Happy Clients"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-12">
              <h3 className="text-2xl font-bold mb-8 max-w-xs leading-tight">
                {testimonials[0].title}
              </h3>
              
              <div className="mb-8 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                <Play size={24} className="text-[#34465d] ml-1" fill="currentColor" />
              </div>

              <div className="mt-auto">
                <StarRating />
                <p className="font-bold text-lg">{testimonials[0].name}</p>
                <p className="text-sm opacity-80">{testimonials[0].role}</p>
              </div>
            </div>
          </motion.div>

          {/* Wrapper for the standard testimonials (7/12) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Standard Testimonial Column 1 */}
            <motion.div 
              className="bg-white p-8 pt-0 flex flex-col shadow-lg rounded-sm h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="h-56 -mx-8 overflow-hidden mb-8">
                <img 
                  src={testimonials[1].image} 
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-5">{testimonials[1].title}</h3>
                <p className="text-[#7C7A70] text-[15px] leading-relaxed mb-8 flex-1">
                  {testimonials[1].text}
                </p>
                
                <div className="pt-6 border-t border-gray-100 mt-auto">
                  <StarRating />
                  <p className="font-bold text-[#1a1a1a]">{testimonials[1].name}</p>
                  <p className="text-xs text-[#7C7A70] uppercase tracking-widest">{testimonials[1].role}</p>
                </div>
              </div>
            </motion.div>

            {/* Standard Testimonial Column 2 */}
            <motion.div 
              className="bg-white p-8 pt-0 flex flex-col shadow-lg rounded-sm h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="h-56 -mx-8 overflow-hidden mb-8">
                <img 
                  src={testimonials[2].image} 
                  alt="Luxury Home"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-5">{testimonials[2].title}</h3>
                <p className="text-[#7C7A70] text-[15px] leading-relaxed mb-8 flex-1">
                  {testimonials[2].text}
                </p>
                
                <div className="pt-6 border-t border-gray-100 mt-auto">
                  <StarRating />
                  <p className="font-bold text-[#1a1a1a]">{testimonials[2].name}</p>
                  <p className="text-xs text-[#7C7A70] uppercase tracking-widest">{testimonials[2].role}</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
