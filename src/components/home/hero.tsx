import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface HeroProps {
  settings?: {
    title: string;
    subtitle: string;
    background_image?: string;
    primary_button_text: string;
    primary_button_link: string;
    secondary_button_text: string;
    secondary_button_link: string;
  };
}

export default function Hero({ settings }: HeroProps) {
  // Default values if no settings provided
  const title = settings?.title || 'Justin Nelson | Boston Realtor';
  const subtitle = settings?.subtitle || 'I deliver the very best in all facets of real estate. Because you deserve no less.';
  const backgroundImage = settings?.background_image || 'https://www.realtorpal.hocud.com/wp-content/uploads/Video-Fall-Back.jpg';
  const primaryButtonText = settings?.primary_button_text || 'CONTACT ME';
  const primaryButtonLink = settings?.primary_button_link || '/contact';
  const secondaryButtonText = settings?.secondary_button_text || 'View Listing';
  const secondaryButtonLink = settings?.secondary_button_link || '/properties';

  return (
    <section className="relative min-h-[70vh] sm:min-h-[85vh] md:min-h-screen h-auto md:h-[110vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ 
          backgroundImage: `url('${backgroundImage}')`,
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 text-center text-white py-12 sm:py-16">
        {/* Title */}
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold tracking-tight mb-6 sm:mb-8 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {title}
        </motion.h1>

        {/* Subtitle with Swoop */}
        <motion.div 
          className="mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-lg sm:text-xl md:text-2xl lg:text-[28px] font-bold max-w-3xl mx-auto leading-snug px-2 sm:px-4 text-[#EADEC9]">
            {subtitle}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href={primaryButtonLink} className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-[#c1a478] hover:bg-[#64748b] text-white px-8 sm:px-10 py-3 sm:py-4 font-bold text-xs sm:text-sm tracking-widest transition-all rounded-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              {primaryButtonText}
            </button>
          </Link>
          
          <Link href={secondaryButtonLink} className="w-full sm:w-auto">
            <button className="w-full sm:w-auto group flex items-center justify-center gap-1 text-white font-bold text-xs sm:text-sm tracking-widest border-b-2 border-white hover:border-[#c1a478] transition-all pb-1">
              {secondaryButtonText}
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Hero Bottom Gradient Blur */}
      <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-gray-950/20 to-transparent z-1" />
    </section>
  );
}
