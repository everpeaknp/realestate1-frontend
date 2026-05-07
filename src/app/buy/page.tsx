import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import { Property } from '@/types';
import styles from './Buy.module.css';

// Extended mock data for browsing
const allProperties: Property[] = [
  {
    _id: '1',
    crmId: 'prop_001',
    title: 'Modern Luxury Villa',
    description: 'A beautiful modern villa with pool.',
    status: 'available',
    price: 1250000,
    propertyType: 'House',
    beds: 4,
    baths: 3,
    sqft: 3200,
    address: { street: '123 Elite Way', city: 'Los Angeles', state: 'CA', zipCode: '90001' },
    images: [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800', isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    crmId: 'prop_002',
    title: 'Downtown Penthouse',
    description: 'Skyline views and premium finishes.',
    status: 'available',
    price: 850000,
    propertyType: 'Apartment',
    beds: 2,
    baths: 2,
    sqft: 1500,
    address: { street: '789 Sky High', city: 'Miami', state: 'FL', zipCode: '33101' },
    images: [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800', isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    crmId: 'prop_003',
    title: 'Serene Garden Estate',
    description: 'Perfect for nature lovers.',
    status: 'sold',
    price: 920000,
    propertyType: 'House',
    beds: 3,
    baths: 3,
    sqft: 2800,
    address: { street: '456 Green Lane', city: 'Seattle', state: 'WA', zipCode: '98101' },
    images: [{ url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800', isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '4',
    crmId: 'prop_004',
    title: 'Coastal Beach House',
    description: 'Steps away from the ocean.',
    status: 'available',
    price: 2100000,
    propertyType: 'House',
    beds: 5,
    baths: 4,
    sqft: 4500,
    address: { street: '42 Wave Crest', city: 'Malibu', state: 'CA', zipCode: '90265' },
    images: [{ url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800', isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '5',
    crmId: 'prop_005',
    title: 'Urban Studio Flat',
    description: 'Minimalist living in the heart of the city.',
    status: 'pending',
    price: 450000,
    propertyType: 'Apartment',
    beds: 1,
    baths: 1,
    sqft: 750,
    address: { street: '101 City Pulse', city: 'New York', state: 'NY', zipCode: '10001' },
    images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800', isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '6',
    crmId: 'prop_006',
    title: 'Mountain Retreat Cabin',
    description: 'Escape to the fresh mountain air.',
    status: 'available',
    price: 680000,
    propertyType: 'House',
    beds: 3,
    baths: 2,
    sqft: 2100,
    address: { street: '99 Pine Crest', city: 'Aspen', state: 'CO', zipCode: '81611' },
    images: [{ url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800', isPrimary: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function BuyPage() {
  return (
    <>
      <Header />
      
      <main className="container section">
        <div className={styles.header}>
          <h1>Browse Properties</h1>
          <p>Displaying {allProperties.length} verified listings</p>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <h3>Search</h3>
              <input type="text" placeholder="Search locations..." className={styles.input} />
            </div>

            <div className={styles.filterGroup}>
              <h3>Property Type</h3>
              <div className={styles.checkboxes}>
                <label className={styles.checkbox}>
                  <input type="checkbox" defaultChecked /> House
                </label>
                <label className={styles.checkbox}>
                  <input type="checkbox" defaultChecked /> Apartment
                </label>
                <label className={styles.checkbox}>
                  <input type="checkbox" defaultChecked /> Land
                </label>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h3>Price Range</h3>
              <div className={styles.flex}>
                <input type="number" placeholder="Min" className={styles.input} />
                <input type="number" placeholder="Max" className={styles.input} />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h3>Stat Filters</h3>
              <select className={styles.select}>
                <option>Any Bedrooms</option>
                <option>1+ Beds</option>
                <option>2+ Beds</option>
                <option>3+ Beds</option>
                <option>4+ Beds</option>
              </select>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }}>Apply Filters</button>
          </aside>

          <div className={styles.mainContent}>
            <div className={styles.grid}>
              {allProperties.map(prop => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
