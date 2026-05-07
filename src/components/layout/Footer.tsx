import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div>
          <h3 className={styles.title}>REALTOR<span>PAL</span></h3>
          <p className={styles.description}>
            Your trusted partner in finding the perfect luxury real estate property. 
            We provide expert guidance and a seamless buying experience.
          </p>
        </div>
        
        <div>
          <h4 className={styles.subTitle}>Quick Links</h4>
          <ul className={styles.links}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/buy">Browse Properties</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/valuation">Home Valuation</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className={styles.subTitle}>Newsletter</h4>
          <p className={styles.text}>Subscribe to get the latest listings and market insights.</p>
          <div className={styles.subscribe}>
            <input type="email" placeholder="Email Address" />
            <button className="btn btn-primary">Join</button>
          </div>
        </div>
      </div>
      
      <div className={styles.bottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Realtor Pal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
