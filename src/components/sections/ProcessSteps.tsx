'use client';

import { Search, Key, Handshake } from 'lucide-react';
import styles from './ProcessSteps.module.css';

export default function ProcessSteps() {
  const steps = [
    { 
      icon: Search, 
      number: '01', 
      title: 'Find Your Home', 
      desc: 'Browse our exclusive catalog of premium properties and find your match.' 
    },
    { 
      icon: Handshake, 
      number: '02', 
      title: 'Expert Consultation', 
      desc: 'Schedule a tour and get professional advice on value and negotiation.' 
    },
    { 
      icon: Key, 
      number: '03', 
      title: 'Closing & Move-in', 
      desc: 'We handle the paperwork to ensure a smooth transition to your new home.' 
    },
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="text-gold">Easy Steps</span>
          <h2 className="font-serif">Our Simple Working Process</h2>
        </div>

        <div className={styles.grid}>
          {steps.map((step, idx) => (
            <div key={idx} className={styles.step}>
              <div className={styles.iconWrapper}>
                <step.icon size={36} />
                <span className={styles.number}>{step.number}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {idx < steps.length - 1 && <div className={styles.arrow}></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
