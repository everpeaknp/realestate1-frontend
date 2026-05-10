'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import LazyImage from '@/components/shared/LazyImage';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  created_at: string;
}

// Fallback data in case API fails
const fallbackFaqData = [
  {
    id: 1,
    question: "Donec id elit non mi porta gravida at eget metus.",
    answer: "Maecenas sed diam eget risus varius blandit sit amet non magna. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.",
    category: "General",
    order: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    question: "Cras mattis consectetur purus sit amet fermentum.",
    answer: "Curabitur blandit tempus porttitor. Vestibulum id ligula porta felis euismod semper. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.",
    category: "General",
    order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    question: "Aenean eu leo quam ellentesque ornare sem lacinia quam",
    answer: "Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
    category: "General",
    order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    question: "Nulla vitae elit libero, a pharetra augue.",
    answer: "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.",
    category: "General",
    order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    question: "Pellentesque ornare sem lacinia quam venenatis vestibulum.",
    answer: "Aenean lacinia bibendum nulla sed consectetur. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.",
    category: "General",
    order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    question: "Cras mattis consectetur purus sit amet fermentum.",
    answer: "Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna mollis ornare vel eu leo.",
    category: "General",
    order: 5,
    created_at: new Date().toISOString()
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqData, setFaqData] = useState<FAQ[]>(fallbackFaqData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faqs/`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch FAQs: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle paginated response (DRF returns {results: [...]} by default)
        const faqs = data.results || data;
        
        if (faqs && faqs.length > 0) {
          setFaqData(faqs);
          console.log(`✓ Loaded ${faqs.length} FAQs from API`);
        } else {
          // Use fallback if no FAQs returned
          console.warn('No FAQs returned from API, using fallback data');
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load FAQs');
        // Keep fallback data on error
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#091E34]"></div>
            <p className="mt-4 text-slate-600">Loading FAQs...</p>
          </div>
        )}

        {/* Error State (still shows fallback data) */}
        {error && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              ⚠️ Using cached FAQs. {error}
            </p>
          </div>
        )}

        {/* FAQ Content */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* FAQ Accordion Side */}
            <div className="space-y-0 border-t border-gray-100">
              {faqData.map((faq, index) => (
                <div 
                  key={faq.id} 
                  className="border-b border-l border-r border-[#E8E8E8]"
                  style={{ borderTop: index === 0 ? '1px solid #E8E8E8' : 'none' }}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-gray-50/50"
                  >
                    <span 
                      className="text-[17px] font-bold leading-tight transition-colors"
                      style={{ color: openIndex === index ? '#091E34' : '#1a1a1a' }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ color: '#091E34' }}
                      className="flex-shrink-0 ml-4"
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
                        <div className="px-6 pb-6 text-slate-600 leading-relaxed text-[15px]">
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
              className="relative h-full min-h-[500px] lg:min-h-[700px] rounded-lg overflow-hidden shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <LazyImage 
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" 
                alt="Modern Home Interior/Exterior" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
            
          </div>
        )}
      </div>
    </section>
  );
}
