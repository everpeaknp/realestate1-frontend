'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { EagleProperty } from '@/lib/eagle-api';

interface PropertyDescriptionProps {
  property: EagleProperty;
}

export default function PropertyDescription({ property }: PropertyDescriptionProps) {
  // Split description into paragraphs; fall back to a default message
  const paragraphs = property.description
    ? property.description.split('\n').map((p) => p.trim()).filter(Boolean)
    : ['Contact us for more information about this property.'];

  // Extract bullet-point features from the description.
  // Eagle descriptions often use "•", "-", or numbered lines for features.
  // We pull lines that look like feature items (short, no full stop at end).
  const featureLines = paragraphs.filter(
    (p) => p.startsWith('•') || p.startsWith('-') || p.startsWith('*') || /^\d+\./.test(p)
  ).map((p) => p.replace(/^[•\-*\d.]+\s*/, '').trim());

  // Body paragraphs are everything that isn't a feature bullet
  const bodyParagraphs = paragraphs.filter(
    (p) => !p.startsWith('•') && !p.startsWith('-') && !p.startsWith('*') && !/^\d+\./.test(p)
  );

  // Use headline as the pull-quote if available
  const pullQuote = property.headline ?? null;

  return (
    <div className="lg:col-span-7">
      {/* Pull quote / headline */}
      {pullQuote && (
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-serif mb-10 leading-[1.3] text-neutral-900"
        >
          {pullQuote}
        </motion.h3>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}
        className="space-y-8 text-on-surface-variant text-lg leading-relaxed font-light"
      >
        {/* Body paragraphs */}
        {bodyParagraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}

        {/* Feature list — only render if we found bullet lines */}
        {featureLines.length > 0 && (
          <div className="pt-10">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-8 underline underline-offset-8 decoration-neutral-300">
              Premium Features
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {featureLines.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 text-sm font-medium text-neutral-700"
                >
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
}
