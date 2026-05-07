'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export default function ServiceCard({ title, description, icon: Icon, href }: ServiceCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <Icon size={32} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <Link href={href} className={styles.link}>
        View Service <span>&gt;</span>
      </Link>
    </div>
  );
}
