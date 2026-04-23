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
      <div className="flex justify-center items-center px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center justify-center max-w-[1280px]">
          {/* Left: Content (Order 2 on mobile, 1 on desktop) */}
          <motion.div 
            className="flex flex-col gap-8 w-full lg:w-[580px] h-[700px] flex-shrink-0 order-2 lg:order-1 justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-4xl font-bold text-[#1a1a1a] mb-6 font-sans">{title}</h2>
              <p className="text-[#7C7A70] text-lg leading-relaxed font-sans mb-8">
                {description}
              </p>

              {/* List Points */}
              <div className="flex flex-col gap-4 mb-10">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#c1a478]" />
                    <span className="text-[#5d6d87] font-medium font-sans">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Action Area */}
              <div className="flex flex-col gap-8 max-w-lg">
                <a 
                  href="/contact"
                  className="w-full py-4 bg-[#c1a478] text-white font-bold uppercase tracking-widest text-sm hover:bg-slate-600 transition-colors shadow-md text-center"
                >
                  {buttonText}
                </a>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4">
                  <div className="flex items-center gap-3 text-[#5d6d87] group cursor-pointer whitespace-nowrap">
                    <Phone size={18} className="text-[#c1a478]" />
                    <span className="font-bold text-[#1a1a1a] group-hover:text-[#c1a478] transition-colors tracking-tight">
                      {phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[#5d6d87] group cursor-pointer whitespace-nowrap">
                    <Mail size={18} className="text-[#c1a478]" />
                    <span className="font-bold text-[#1a1a1a] group-hover:text-[#c1a478] transition-colors tracking-tight">
                      {email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Image Box (Order 1 on mobile, 2 on desktop) */}
          <motion.div 
            className="relative overflow-hidden w-full lg:w-[640px] h-[700px] flex-shrink-0 order-1 lg:order-2"
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
