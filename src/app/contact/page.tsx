'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';
import ContactHero from '@/components/contact/contactHero';
import ContactCards from '@/components/contact/ContactCards';
import ContactFormSection from '@/components/contact/ContactFormSection';
import { contactAPI } from '@/lib/api';

interface ContactCard {
  id: number;
  title: string;
  value: string;
  icon: string;
  order: number;
  is_active: boolean;
}

interface ContactFormSettings {
  id: number;
  intro_text: string;
  agent_name: string;
  agent_title: string;
  agent_image: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  linkedin_url: string;
  is_active: boolean;
}

export default function ContactPage() {
  const [cards, setCards] = useState<ContactCard[]>([]);
  const [formSettings, setFormSettings] = useState<ContactFormSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const [cardsData, settingsData] = await Promise.all([
          contactAPI.getCards(),
          contactAPI.getFormSettings()
        ]);
        
        setCards(cardsData);
        // API returns array, get first active item
        const activeSettings = settingsData.find((s: ContactFormSettings) => s.is_active);
        setFormSettings(activeSettings || settingsData[0] || null);
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  return (
    <>
      <Header />
      <ContactHero />
      {!loading && (
        <>
          <ContactCards cards={cards} introText={formSettings?.intro_text} />
          {formSettings && <ContactFormSection settings={formSettings} />}
        </>
      )}
      {loading && (
        <>
          <ContactCards />
          <ContactFormSection />
        </>
      )}
      <ContactSection />
      <Newsletter />
      <Instagram />
      <Footer />
    </>
  );
}
