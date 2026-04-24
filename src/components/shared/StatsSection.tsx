'use client';

import { Crown, Users, MapPinned, Star, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { homeAPI } from '@/lib/api';

// Icon mapping for dynamic icon selection
const iconMap: Record<string, LucideIcon> = {
  Crown,
  Users,
  MapPinned,
  Star,
  crown: Crown,
  users: Users,
  'map-pinned': MapPinned,
  star: Star,
};

const defaultStats = [
  {
    icon: 'Crown',
    label: '12+ Years of Experience',
    description: 'Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio, dapibus ac facilisis in, egestas eget quam.',
  },
  {
    icon: 'Users',
    label: '1500+ Satisfied Clients',
    description: 'Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio, dapibus ac facilisis in, egestas eget quam.',
  },
  {
    icon: 'MapPinned',
    label: '24 Locations Covered',
    description: 'Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio, dapibus ac facilisis in, egestas eget quam.',
  },
  {
    icon: 'Star',
    label: '100+ Five Star Ratings',
    description: 'Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio, dapibus ac facilisis in, egestas eget quam.',
  },
];

interface StatsSectionProps {
  stats?: any[];
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const [dynamicStats, setDynamicStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(!stats);

  useEffect(() => {
    // Only fetch if stats are not provided as props
    if (!stats) {
      const fetchStats = async () => {
        try {
          console.log('Fetching stats...');
          const data = await homeAPI.getStats();
          console.log('Stats data received:', data);
          if (data && data.length > 0) {
            console.log('Setting dynamic stats:', data);
            setDynamicStats(data);
          } else {
            console.log('No stats data received, using defaults');
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [stats]);

  // Use provided stats, or fetched stats, or defaults
  const statsToUse = stats || (dynamicStats.length > 0 ? dynamicStats : defaultStats);

  console.log('StatsSection render - stats prop:', stats, 'dynamicStats:', dynamicStats, 'using:', statsToUse);

  if (loading) {
    console.log('StatsSection still loading...');
    return null;
  }

  // Merge stats with default icons if needed
  const statsData = statsToUse.map((stat: any, index: number) => {
    // If stat has an icon property that's a string, map it to the component
    let IconComponent;
    
    if (typeof stat.icon === 'string') {
      // Try to find icon by exact match first, then try lowercase
      IconComponent = iconMap[stat.icon] || iconMap[stat.icon.toLowerCase()] || Star;
    } else if (typeof stat.icon_name === 'string') {
      // Also check icon_name field from API
      IconComponent = iconMap[stat.icon_name] || iconMap[stat.icon_name.toLowerCase()] || Star;
    } else {
      IconComponent = stat.icon || defaultStats[index]?.icon || Star;
    }
    
    return {
      ...stat,
      IconComponent: typeof IconComponent === 'string' ? iconMap[IconComponent] || Star : IconComponent,
    };
  });
  return (
    <section className="bg-[#586C89] w-full py-0 text-white overflow-hidden px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-auto relative max-w-7xl">
        {statsData.map((stat, index) => (
          <div key={stat.label || index} className="relative min-h-[181px]">
            {/* Left border for first item on desktop, top border on mobile */}
            {index === 0 && (
              <>
                <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[1px] bg-white/30 z-20" />
                <div className="block lg:hidden absolute left-0 right-0 top-0 h-[1px] bg-white/30 z-20" />
              </>
            )}
            
            {/* Right border on desktop, bottom border on mobile */}
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[1px] bg-white/30 z-20" />
            <div className="block lg:hidden absolute left-0 right-0 bottom-0 h-[1px] bg-white/30 z-20" />
            
            <div className="h-full min-h-[181px] [perspective:1200px]">
            <motion.div
              className="relative w-full h-full cursor-pointer origin-center"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{ rotateX: 90 }} // Rolls from front down to reveal the face below
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Front Face: Conceptually "Part of the Circle" animation wise */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 gap-4 sm:gap-6 text-center bg-[#586C89] [backface-visibility:hidden]"
                style={{ 
                  transform: "translateZ(90.5px)", // 90.5px is half the height (181px)
                  WebkitBackfaceVisibility: "hidden" 
                }}
              >
                {/* Brand Elements in original layout */}
                <div className="text-[#ece6d9]">
                  <stat.IconComponent size={32} className="sm:w-9 sm:h-9" strokeWidth={1} fill="currentColor" fillOpacity={0.2} />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-tight px-2 sm:px-4 leading-snug text-white">
                  {stat.label}
                </h3>
              </div>

              {/* Bottom Face (Rotating Up to Front) */}
              <div 
                className="absolute inset-0 w-full h-full bg-[#586C89] px-6 sm:px-10 flex flex-col items-center justify-center text-center [backface-visibility:hidden]"
                style={{ 
                  transform: "rotateX(-90deg) translateZ(90.5px)", 
                  WebkitBackfaceVisibility: "hidden" 
                }}
              >
                <p className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-[#ece6d9] italic font-medium max-w-[240px]">
                  {stat.description || 'Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio, dapibus ac facilisis in, egestas eget quam.'}
                </p>
              </div>
            </motion.div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}



