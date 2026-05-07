'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './AboutAgent.module.css';

export default function AboutAgent() {
  return (
    <section className={styles.section}>
      <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center', gap: '60px' }}>
        <div className={styles.content}>
          <span className={styles.subtitle}>Since 2008</span>
          <h2 className={styles.title}>Helping You Find Your <br /><span>Perfect Home</span></h2>
          <p className={styles.description}>
            With over 15 years of experience in the luxury real estate market, I provide 
            unparalleled expertise and personal attention to every client. My mission is 
            to simplify the complex process of buying or selling your home.
          </p>
          
          <ul className={styles.features}>
            <li>Market Valuation Analysis</li>
            <li>Premium Property Listings</li>
            <li>Expert Negotiation Support</li>
            <li>Virtual Home Tours</li>
          </ul>

          <div className={styles.actions}>
            <Link href="/contact" className="btn btn-accent">Learn More About Me</Link>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <div className={styles.mainImage}>
             <Image 
               src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"
               alt="Luxury Real Estate Agent"
               width={500}
               height={600}
               style={{ borderRadius: 'var(--border-radius)', objectFit: 'cover' }}
             />
          </div>
          <div className={styles.floatingCard}>
            <div className={styles.cardIcon}>🏆</div>
            <div>
              <h3>#1 Agent</h3>
              <p>Top Performer 2023</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
