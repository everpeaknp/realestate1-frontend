'use client';

import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';


const faqData = [
  {
    question: "Donec id elit non mi porta gravida at eget metus.",
    answer: "Maecenas sed diam eget risus varius blandit sit amet non magna. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui."
  },
  {
    question: "Cras mattis consectetur purus sit amet fermentum.",
    answer: "Curabitur blandit tempus porttitor. Vestibulum id ligula porta felis euismod semper. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum."
  },
  {
    question: "Aenean eu leo quam ellentesque ornare sem lacinia quam",
    answer: "Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
  },
  {
    question: "Nulla vitae elit libero, a pharetra augue.",
    answer: "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus."
  },
  {
    question: "Pellentesque ornare sem lacinia quam venenatis vestibulum.",
    answer: "Aenean lacinia bibendum nulla sed consectetur. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."
  },
  {
    question: "Cras mattis consectetur purus sit amet fermentum.",
    answer: "Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna mollis ornare vel eu leo."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* FAQ Accordion Side */}
          <div className="space-y-0 border-t border-gray-100">
            {faqData.map((faq, index) => (
              <div 
                key={index} 
                className="border-b border-l border-r border-[#E8E8E8]"
                style={{ borderTop: index === 0 ? '1px solid #E8E8E8' : 'none' }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-gray-50/50"
                >
                  <span className={`text-[17px] font-bold leading-tight transition-colors ${
                    openIndex === index ? 'text-[#BF974F]' : 'text-[#1a1a1a]'
                  }`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#c1a478] flex-shrink-0 ml-4"
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-[#5d6d87] leading-relaxed text-[15px]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Image Side */}
          <motion.div 
            className="relative h-full min-h-[500px] lg:min-h-[700px] rounded-none overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" 
              alt="Modern Home Interior/Exterior" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
