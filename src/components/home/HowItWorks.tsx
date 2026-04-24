import { Clock, BarChart3, Heart, ChevronRight, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

// Icon mapping for dynamic icon selection
const iconMap: Record<string, LucideIcon> = {
  Clock,
  BarChart3,
  Heart,
};

const defaultSteps = [
  {
    number: '1',
    title: 'Make an appointment',
    icon: 'Clock',
  },
  {
    number: '2',
    title: 'Evaluate the property',
    icon: 'BarChart3',
  },
  {
    number: '3',
    title: 'Close the deal. Enjoy!',
    icon: 'Heart',
  },
];

interface HowItWorksProps {
  steps?: any[];
}

export default function HowItWorks({ steps = defaultSteps }: HowItWorksProps) {
  // Merge steps with default icons if needed
  const stepsData = (steps || defaultSteps).map((step, index) => {
    // If step has an icon property that's a string, map it to the component
    const IconComponent = typeof step.icon === 'string' 
      ? iconMap[step.icon] || Clock 
      : step.icon || defaultSteps[index]?.icon || Clock;
    
    return {
      ...step,
      IconComponent: typeof IconComponent === 'string' ? iconMap[IconComponent] || Clock : IconComponent,
    };
  });
  return (
    <section className="bg-[#FFFAF3] py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4 sm:mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-[#7C7A70] max-w-3xl mx-auto text-base sm:text-lg leading-relaxed font-medium px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            If you've owned property, or it's your first time, and you're ready to submit an offer 
            or think about it in the next year or two, contact me now.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-8 relative">
          {stepsData.map((step, index) => (
            <div key={step.number || index} className="flex-1 w-full max-w-md lg:max-w-none flex items-center relative gap-8 lg:gap-0">
              {/* Card */}
              <motion.div
                className="w-full bg-[#5d6d87] p-6 sm:p-8 py-10 sm:py-12 flex flex-col items-center justify-center gap-4 sm:gap-6 relative overflow-hidden group shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                {/* Step Ribbon */}
                <div className="absolute top-4 left-[-35px] z-10 w-[140px] h-8 bg-[#ece6d9] flex items-center justify-center -rotate-45 shadow-sm">
                  <span className="text-[#5d6d87] text-[10px] font-bold tracking-widest pl-2">STEP {step.number}</span>
                </div>

                {/* Icon */}
                <div className="text-[#ece6d9] mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  <step.IconComponent size={40} strokeWidth={1.5} className="sm:w-12 sm:h-12" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide text-center px-2">
                  {step.title}
                </h3>
              </motion.div>

              {/* Dotted Arrow Connector (only between steps on desktop) */}
              {index < stepsData.length - 1 && (
                <div className="hidden lg:flex flex-1 items-center justify-center px-4">
                  <div className="w-full h-px border-b border-dashed border-[#7C7A70]/60 relative flex items-center justify-end">
                    <ChevronRight size={16} className="text-[#c1a478] absolute -right-1" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
