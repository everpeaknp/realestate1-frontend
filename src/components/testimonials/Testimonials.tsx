'use client';

import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';



interface TestimonialItem {
  id: string;
  title: string;
  text: string;
  name: string;
  role: string;
  image: string;
}

const testimonials: TestimonialItem[] = [
  {
    id: '1',
    title: 'Brilliant Service',
    text: 'Donec id elit non mi porta gravida at eget metus. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    name: 'Logan Holt',
    role: 'Happy Buyer',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '2',
    title: 'The Best Realtor',
    text: 'Donec id elit non mi porta gravida at eget metus. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    name: 'Mollie Hope',
    role: 'Happy Buyer',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '3',
    title: 'Highly Recommended',
    text: 'Donec id elit non mi porta gravida at eget metus. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    name: 'James Wilson',
    role: 'Happy Seller',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '4',
    title: 'Professional Team',
    text: 'Donec id elit non mi porta gravida at eget metus. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    name: 'Sarah Jenkins',
    role: 'Happy Buyer',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '5',
    title: 'Great Experience',
    text: 'Donec id elit non mi porta gravida at eget metus. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    name: 'Emily Davis',
    role: 'Happy Seller',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '6',
    title: 'Very Helpful',
    text: 'Donec id elit non mi porta gravida at eget metus. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    name: 'Michael Brown',
    role: 'Happy Buyer',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=300',
  },
];

function StarRating() {
  return (
    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className="text-[#f39c12] fill-current" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-white py-12 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <motion.span 
            className="text-[#c1a478] font-bold text-sm uppercase tracking-[0.2em] mb-4 block"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Testimonials
          </motion.span>
          <motion.h2 
            className="text-4xl font-bold text-[#1a1a1a] mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Our Clients Say
          </motion.h2>
        </div>

        {/* Testimonials Grid - 2 Columns, 3 Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-white p-8 border border-gray-100 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                {/* Image */}
                <div className="w-[120px] h-[120px] flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded-sm"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">{item.title}</h3>
                  <p className="text-[#5d6d87] text-[15px] leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto">
                <StarRating />
                <div>
                  <p className="font-bold text-[#1a1a1a] text-lg">{item.name}</p>
                  <p className="text-sm text-[#5d6d87]">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
