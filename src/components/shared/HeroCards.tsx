'use client';

import {
  Send, Building2, Hourglass, Wallet,
  ChevronRight, Home, Key, Building, DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { homeAPI } from '@/lib/api';

// Icon mapping
const iconMap: Record<string, any> = {
  send: Send,
  building2: Building2,
  hourglass: Hourglass,
  wallet: Wallet,
  home: Home,
  key: Key,
  building: Building,
  'dollar-sign': DollarSign,
};

interface HeroCardsProps {
  cards?: Array<{
    id: number;
    title: string;
    description: string;
    icon_name: string;
    link: string;
  }>;
}

export default function HeroCards({ cards: cardsData }: HeroCardsProps) {
  const [dynamicCards, setDynamicCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(!cardsData);

  const defaultCards = [
    {
      id: 1,
      title: 'Sell Property',
      description: 'Sell faster with expert guidance.',
      icon_name: 'send',
      link: '/services#sell',
    },
    {
      id: 2,
      title: 'Buy Property',
      description: 'Find your perfect home easily.',
      icon_name: 'building2',
      link: '/services#buy',
    },
    {
      id: 3,
      title: 'Rent Property',
      description: 'Flexible rental solutions for you.',
      icon_name: 'hourglass',
      link: '/services#rent',
    },
    {
      id: 4,
      title: 'Home Loan',
      description: 'Get financing without hassle.',
      icon_name: 'wallet',
      link: '/services#loan',
    },
  ];

  useEffect(() => {
    if (!cardsData) {
      const fetchCards = async () => {
        try {
          const data = await homeAPI.getHeroCards();
          if (data && data.length > 0) {
            setDynamicCards(data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchCards();
    }
  }, [cardsData]);

  const cards = cardsData || (dynamicCards.length ? dynamicCards : defaultCards);

  if (loading) return null;

  return (
    <div className="relative z-20 -mt-20 flex justify-center px-4">

      {/* CENTER WRAPPER */}
      <div className="flex flex-wrap justify-center gap-6 max-w-6xl">

        {cards.map((card, index) => {
          const IconComponent = iconMap[card.icon_name] || Home;

          return (
            <motion.div
              key={card.id}
              className="
                w-[280px] sm:w-[300px] lg:w-[260px]
                bg-[#FFFAF3]
                p-8
                flex flex-col justify-between
                gap-6
                shadow-xl
                border-t-4 border-transparent
                hover:border-[#c1a478]
                transition-all duration-300
                relative group/card
              "
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
            >
              {/* ICON */}
              <div className="absolute top-6 right-6 text-[#c1a478]">
                <IconComponent size={40} strokeWidth={1} />
              </div>

              {/* TEXT */}
              <div className="space-y-4 pr-10">
                <h3 className="text-lg font-bold text-[#1a1a1a] group-hover/card:text-[#c1a478] transition">
                  {card.title}
                </h3>

                <p className="text-[#7C7A70] text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* LINK */}
              <Link
                href={card.link}
                className="group flex items-center gap-1 text-[11px] font-bold tracking-widest text-[#1a1a1a] border-b border-[#1a1a1a]/20 hover:border-[#c1a478] pb-1 uppercase"
              >
                View Service
                <ChevronRight size={14} className="group-hover:translate-x-1 transition" />
              </Link>
            </motion.div>
          );
        })}

      </div>
    </div>
  );
}