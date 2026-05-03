'use client';
import { motion } from 'framer-motion';
import { CheckCircle2, Phone, Mail } from 'lucide-react';

interface ServiceFeature {
  id: number;
  text: string;
  order: number;
}

interface SellPropertySectionProps {
  title?: string;
  description?: string;
  image?: string;
  phone?: string;
  email?: string;
  buttonText?: string;
  features?: ServiceFeature[];
}

export default function SellPropertySection({
  title = 'Sell Property',
  description = 'Etiam porta sem malesuada magna mollis euismod. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Sed posuere consectetur est at lobortis. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.',
  image = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600',
  phone = '+1 (321) 456 7890',
  email = 'hello@example.com',
  buttonText = 'Contact Me',
  features = [
    { id: 1, text: 'Ornare sem lacinia quam venenatis vestibulum.', order: 0 },
    { id: 2, text: 'Morbi leo risus porta vestibulum at eros.', order: 1 },
    { id: 3, text: 'Donec id elit non mi porta gravida at eget metus.', order: 2 },
    { id: 4, text: 'Nulla vitae elit libero, a pharetra augue.', order: 3 }
  ]
}: SellPropertySectionProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-16 items-center">
          {/* Left: Content (Order 2 on mobile, 1 on desktop) */}
          <motion.div 
            className="flex flex-col gap-6 sm:gap-8 w-full lg:flex-1 lg:max-w-[580px] order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="-mt-4 lg:mt-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4 sm:mb-6 font-sans">{title}</h2>
              <p className="text-[#7C7A70] text-base sm:text-lg leading-relaxed font-sans mb-6 sm:mb-8">
                {description}
              </p>

              {/* List Points */}
              <div className="flex flex-col gap-3 sm:gap-4 mb-8 sm:mb-10">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-[#c1a478] flex-shrink-0 mt-0.5" />
                    <span className="text-[#5d6d87] font-medium font-sans text-sm sm:text-base">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Action Area */}
              <div className="flex flex-col gap-6 sm:gap-8">
                <a 
                  href="/contact"
                  className="w-full py-3 sm:py-4 bg-[#c1a478] text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-slate-600 transition-all shadow-md text-center rounded-sm min-h-[44px] flex items-center justify-center transform hover:-translate-y-0.5"
                >
                  {buttonText}
                </a>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-x-8">
                  <a 
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 text-[#5d6d87] group cursor-pointer min-h-[44px]"
                  >
                    <Phone size={18} className="text-[#c1a478] flex-shrink-0" fill="currentColor" stroke="none" />
                    <span className="font-bold text-[#1a1a1a] group-hover:text-[#c1a478] transition-colors text-sm sm:text-base">
                      {phone}
                    </span>
                  </a>
                  <a 
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-[#5d6d87] group cursor-pointer min-h-[44px]"
                  >
                    <Mail size={18} className="text-[#c1a478] flex-shrink-0" />
                    <span className="font-bold text-[#1a1a1a] group-hover:text-[#c1a478] transition-colors text-sm sm:text-base break-all">
                      {email}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Image Box (Order 1 on mobile, 2 on desktop) */}
          <motion.div 
            className="relative overflow-hidden w-full lg:flex-1 min-h-[400px] sm:min-h-[500px] lg:h-[700px] order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
