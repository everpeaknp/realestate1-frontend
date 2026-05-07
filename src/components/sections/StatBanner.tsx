'use client';

import { Users, MapPin, Award, Calendar } from 'lucide-react';
import styles from './StatBanner.module.css';

export default function StatBanner() {
  const stats = [
    { icon: Calendar, value: '15+', label: 'Years Experience' },
    { icon: Users, value: '2500+', label: 'Happy Clients' },
    { icon: MapPin, value: '40+', label: 'Prime Locations' },
    { icon: Award, value: '12', label: 'Agency Awards' },
  ];

  return (
    <section className={styles.banner}>
      <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statItem}>
            <div className={styles.iconWrapper}>
              <stat.icon size={32} />
            </div>
            <div className={styles.textWrapper}>
              <h3 className={styles.value}>{stat.value}</h3>
              <p className={styles.label}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
