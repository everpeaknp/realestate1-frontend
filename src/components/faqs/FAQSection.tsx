'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
}

const FALLBACK_FAQS: FAQ[] = [
  {
    id: 1,
    question: "How much do I need for a down payment?",
    answer: "Typically, you'll need 3–20% of the home's purchase price for a down payment. First-time buyers may qualify for programs requiring as little as 3% down.",
    category: "Buying",
    order: 1,
  },
  {
    id: 2,
    question: "How long does it take to sell a home?",
    answer: "The average time to sell a home varies by market conditions, but typically ranges from 30–90 days. Proper pricing and staging can significantly reduce this time.",
    category: "Selling",
    order: 2,
  },
  {
    id: 3,
    question: "What is the difference between pre-qualification and pre-approval?",
    answer: "Pre-qualification is an estimate of what you can afford based on self-reported information. Pre-approval involves a thorough review of your finances and is more reliable.",
    category: "Financing",
    order: 3,
  },
  {
    id: 4,
    question: "Do I need a real estate agent?",
    answer: "While not required, a real estate agent provides valuable expertise, market knowledge, negotiation skills, and handles complex paperwork, often at no direct cost to buyers.",
    category: "General",
    order: 4,
  },
  {
    id: 5,
    question: "What are closing costs?",
    answer: "Closing costs are fees associated with finalizing a real estate transaction, typically 2–5% of the purchase price. They include appraisal fees, title insurance, and loan origination fees.",
    category: "Buying",
    order: 5,
  },
  {
    id: 6,
    question: "Should I get a home inspection?",
    answer: "Yes! A home inspection is highly recommended to identify potential issues before purchase. It typically costs $300–500 but can save thousands in unexpected repairs.",
    category: "Buying",
    order: 6,
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FAQ[]>(FALLBACK_FAQS);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    fetch(`${apiUrl}/api/faqs/`)
      .then((res) => res.ok ? res.json() : Promise.reject(res.status))
      .then((data: { results?: FAQ[]; count?: number } | FAQ[]) => {
        // Handle both paginated and non-paginated responses
        const list = Array.isArray(data) ? data : (data.results ?? []);
        if (list.length > 0) setFaqs(list);
      })
      .catch(() => {
        // Keep fallback data on error — no design change
      });
  }, []);

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* FAQ Accordion Side */}
          <div className="space-y-0 border-t border-gray-100">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
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
