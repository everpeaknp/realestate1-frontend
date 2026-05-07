'use client';

import { Star, Quote } from 'lucide-react';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const reviews = [
    { 
      name: 'Sarah Johnson', 
      role: 'Home Buyer', 
      text: 'Working with Realtor Pal was a game changer. Their attention to detail and market knowledge helped us find our dream villa in record time.',
      rating: 5
    },
    { 
      name: 'Michael Chen', 
      role: 'Investment Client', 
      text: 'The best real estate experience I have ever had. Professional, responsive, and they truly care about your long-term satisfaction.',
      rating: 5
    },
    { 
      name: 'Emma Williams', 
      role: 'Home Seller', 
      text: 'They sold our property above asking price! The marketing strategy and staging advice were spot on. Highly recommend their services.',
      rating: 5
    },
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="text-gold">Testimonials</span>
          <h2 className="font-serif">What Our Clients Say</h2>
        </div>

        <div className={styles.grid}>
          {reviews.map((rev, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.quoteIcon}><Quote size={40} fill="currentColor" /></div>
              <div className={styles.rating}>
                {[...Array(rev.rating)].map((_, i) => <Star key={i} size={16} fill="var(--accent)" color="var(--accent)" />)}
              </div>
              <p className={styles.text}>"{rev.text}"</p>
              <div className={styles.footer}>
                <div className={styles.avatar}>{{ name: rev.name.charAt(0) }.name}</div>
                <div>
                  <h4>{rev.name}</h4>
                  <span>{rev.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
