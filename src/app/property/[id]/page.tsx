import Image from 'next/image';
import { Bed, Bath, Square, MapPin, Calendar, Building, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LeadForm from '@/components/forms/LeadForm';
import { Property } from '@/types';
import styles from './PropertyDetail.module.css';

// Mock function to simulate property lookup
function getProperty(id: string): Property {
    return {
        _id: id,
        crmId: 'prop_001',
        title: 'Modern Luxury Villa with Ocean Views',
        description: `This stunning modern villa offers the ultimate in luxury living. 
        Featuring an open-concept design with floor-to-ceiling windows, 
        this home blends indoor and outdoor spaces seamlessly. 
        The gourmet kitchen is equipped with state-of-the-art appliances, 
        while the master suite offers a private balcony overlooking the coast.`,
        status: 'available',
        price: 1250000,
        propertyType: 'House',
        beds: 4,
        baths: 3,
        sqft: 3200,
        address: { street: '123 Elite Way', city: 'Los Angeles', state: 'CA', zipCode: '90001' },
        images: [
            { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200', isPrimary: true },
            { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800' },
            { url: 'https://images.unsplash.com/photo-1600607687940-4e2a09695d51?auto=format&fit=crop&q=80&w=800' }
        ],
        features: {
            "Pool": true,
            "Garage": "2 Cars",
            "Cooling": "Central AC",
            "Heating": "Natural Gas",
            "Finished Basement": true
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = getProperty(id);

  return (
    <>
      <Header />
      
      <main>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.breadcrumb}>
              Buy / Properties / {property.title}
            </div>
            <div className={styles.header}>
              <div>
                <h1>{property.title}</h1>
                <div className={styles.location}>
                  <MapPin size={18} /> {property.address.street}, {property.address.city}, {property.address.state}
                </div>
              </div>
              <div className={styles.price}>
                ${property.price.toLocaleString()}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className={styles.layout}>
              <div className={styles.content}>
                {/* Gallery */}
                <div className={styles.gallery}>
                  <div className={styles.mainImage}>
                    <Image 
                      src={property.images[0].url} 
                      alt={property.title} 
                      fill 
                      className={styles.img}
                    />
                  </div>
                  <div className={styles.thumbs}>
                    {property.images.slice(1).map((img, i) => (
                      <div key={i} className={styles.thumb}>
                        <Image src={img.url} alt="Thumbnail" fill className={styles.img} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Details */}
                <div className={styles.keyDetails}>
                  <div className={styles.detailItem}>
                    <Bed size={24} />
                    <div><span>{property.beds}</span> Bedrooms</div>
                  </div>
                  <div className={styles.detailItem}>
                    <Bath size={24} />
                    <div><span>{property.baths}</span> Bathrooms</div>
                  </div>
                  <div className={styles.detailItem}>
                    <Square size={24} />
                    <div><span>{property.sqft}</span> Sq Ft</div>
                  </div>
                  <div className={styles.detailItem}>
                    <Building size={24} />
                    <div><span>{property.propertyType}</span> Type</div>
                  </div>
                </div>

                {/* Description */}
                <div className={styles.descriptionSection}>
                  <h3>Description</h3>
                  <p>{property.description}</p>
                </div>

                {/* Features */}
                <div className={styles.featuresSection}>
                  <h3>Property Features</h3>
                  <div className={styles.featuresGrid}>
                    {Object.entries(property.features || {}).map(([key, val]) => (
                      <div key={key} className={styles.feature}>
                        <Check size={16} color="var(--color-surface-muted)" />
                        <strong>{key}:</strong> {val === true ? 'Yes' : val}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <aside className={styles.sidebar}>
                <div className={styles.stickySidebar}>
                  <LeadForm 
                    type="contact" 
                    title="Inquire About This Property"
                    subtitle="Our agents will respond within 24 hours."
                  />
                  
                  <div className={styles.agentInfo}>
                    <div className={styles.agentHeader}>
                      <div className={styles.agentAvatar}>JD</div>
                      <div>
                        <h4>John Doe</h4>
                        <p>Senior Real Estate Agent</p>
                      </div>
                    </div>
                    <button className="btn btn-accent" style={{ width: '100%', marginTop: '15px' }}>
                      Schedule a Tour
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
