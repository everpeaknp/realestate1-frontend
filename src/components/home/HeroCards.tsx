import { Send, Building2, Hourglass, Wallet, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const cards = [
  {
    title: 'Sell Property',
    description: 'Etiam porta sem malesuada magna mollis socii natoqe penatibus magnis dis nascetur odio posuere erat.',
    icon: Send,
  },
  {
    title: 'Buy Property',
    description: 'Etiam porta sem malesuada magna mollis socii natoqe penatibus magnis dis nascetur odio posuere erat.',
    icon: Building2,
  },
  {
    title: 'Rent Property',
    description: 'Etiam porta sem malesuada magna mollis socii natoqe penatibus magnis dis nascetur odio posuere erat.',
    icon: Hourglass,
  },
  {
    title: 'Home Loan',
    description: 'Etiam porta sem malesuada magna mollis socii natoqe penatibus magnis dis nascetur odio posuere erat.',
    icon: Wallet,
  },
];

export default function HeroCards() {
  return (
    <div className="relative z-20 mx-auto max-w-7xl px-6 -mt-32">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            className="bg-[#FFFAF3] p-10 flex flex-col items-start gap-6 shadow-xl border-t-4 border-transparent hover:border-[#c1a478] transition-all duration-300 relative group/card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ y: -10 }}
          >
            <div className="absolute top-8 right-8 text-[#c1a478]">
              <card.icon size={44} strokeWidth={1} />
            </div>
            
            <div className="space-y-4 pr-12">
              <h3 className="text-xl font-bold text-[#1a1a1a] transition-colors group-hover/card:text-[#c1a478]">
                {card.title}
              </h3>
              <p className="text-[#7C7A70] text-sm leading-relaxed">
                {card.description}
              </p>
            </div>

            <a 
              href="#" 
              className="group flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] text-[#1a1a1a] border-b border-[#1a1a1a]/20 hover:border-[#c1a478] transition-colors pb-1 mt-4 uppercase"
            >
              View Service
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
