import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import { Property } from '@/types';
import styles from './PropertyCard.module.css';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const primaryImage = property.images.find(img => img.isPrimary) || property.images[0];
  const placeholderImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';

  const statusColors = {
    available: '#82b440',
    sold: '#545454',
    pending: '#C49A6C',
    under_contract: '#000000'
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <div className={`${styles.ribbon} ${property.status === 'available' ? styles.sale : styles.sold}`}>
          {property.status === 'available' ? 'FOR SALE' : property.status.toUpperCase()}
        </div>
        <Image 
          src={primaryImage?.url || placeholderImage} 
          alt={property.title}
          fill
          className={styles.image}
        />
      </div>
      
      <div className={styles.content}>
        <div className={styles.price}>
          ${property.price.toLocaleString()}
        </div>
        
        <h3 className={styles.title}>
          <Link href={`/properties/${property._id}`}>
            {property.title}
          </Link>
        </h3>
        
        <div className={styles.location}>
          <MapPin size={14} /> {property.address.city}, {property.address.state}
        </div>
        
        <div className={styles.stats}>
          <div className={styles.stat}>
            <Bed size={16} /> {property.beds} <span>Beds</span>
          </div>
          <div className={styles.stat}>
            <Bath size={16} /> {property.baths} <span>Baths</span>
          </div>
          <div className={styles.stat}>
            <Square size={16} /> {property.sqft} <span>Sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
