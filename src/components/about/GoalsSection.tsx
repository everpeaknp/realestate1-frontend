'use client';

import { motion } from 'framer-motion';

interface Goal {
  id: number;
  title: string;
  description: string;
  order: number;
}

interface GoalsSectionProps {
  goals?: Goal[];
}

export default function GoalsSection({ goals: propGoals }: GoalsSectionProps) {
  const defaultGoals = [
    {
      id: 1,
      title: 'Full Service Agent',
      description: "I'm honored that client referrals built my growing client family exclusively. My tried-and-true techniques give my clients a competitive advantage in this market environment.",
      order: 1
    },
    {
      id: 2,
      title: 'My Approach',
      description: 'I intend not just to make a good impact on ourselves and our families but also to inspire, encourage, and bring about permanent change in everyone we meet.',
      order: 2
    },
    {
      id: 3,
      title: 'My Values',
      description: 'My work ethic and the success of my business are driven by this guiding principle, which motivates me to maintain long-lasting connections with clients.',
      order: 3
    }
  ];

  const goals = propGoals || defaultGoals;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              className="w-[387px] h-[330px] flex flex-col justify-center p-10 border border-[#E8E8E8] bg-white hover:border-[#c1a478] hover:shadow-xl transition-all duration-500 rounded-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-6 font-sans">
                {goal.title}
              </h3>
              <p className="text-[#5d6d87] leading-relaxed text-[15px] font-sans">
                {goal.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
