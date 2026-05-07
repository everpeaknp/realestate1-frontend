'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './Neighborhoods.module.css';

export default function Neighborhoods() {
  const areas = [
    { name: 'Beverly Hills', slug: 'beverly-hills', count: 24, img: 'https://images.unsplash.com/photo-1628744276520-67306f14f6b0?q=80&w=800' },
    { name: 'Santa Monica', slug: 'santa-monica', count: 18, img: 'https://images.unsplash.com/photo-1548543604-a87c9909afce?q=80&w=800' },
    { name: 'Malibu', slug: 'malibu', count: 12, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800' },
    { name: 'Hollywood', slug: 'hollywood', count: 32, img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800' },
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="text-gold">Explore Areas</span>
          <h2 className="font-serif">Popular Neighborhoods</h2>
        </div>

        <div className={styles.grid}>
          {areas.map((area, idx) => (
            <Link href={`/buy?location=${area.slug}`} key={idx} className={styles.card}>
              <Image 
                src={area.img} 
                alt={area.name} 
                fill 
                className={styles.image}
              />
              <div className={styles.overlay}>
                <h3>{area.name}</h3>
                <p>{area.count} Listings</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
