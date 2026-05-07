import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className="container flex justify-between items-center">
          <div className={styles.contactInfo}>
            <span className="flex items-center gap-1">
              <Phone size={14} /> +1 (234) 567-890
            </span>
            <span className="flex items-center gap-1">
              <Mail size={14} /> hello@realtorpal.com
            </span>
          </div>
          <div className={styles.socials}>
            {/* Social icons removed to ensure build success */}
          </div>
        </div>
      </div>
      
      <nav className={styles.nav}>
        <div className="container flex justify-between items-center">
          <Link href="/" className={styles.logo}>
            REALTOR<span>PAL</span>
          </Link>
          
          <ul className={styles.navLinks}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/buy">Buy Properties</Link></li>
            <li><Link href="/sell">Sell Your Home</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
          
          <Link href="/buy" className="btn btn-primary">
            View Listings
          </Link>
        </div>
      </nav>
    </header>
  );
}
