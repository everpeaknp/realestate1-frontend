'use client';

import { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const INQUIRY_MAP: Record<string, string> = {
  buying:    'BUYING',
  selling:   'SELLING',
  renting:   'RENTING',
  'home-loan': 'HOME_LOAN',
};

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

interface ContactFormSectionProps {
  settings?: ContactFormSettings;
}

export default function ContactFormSection({ 
  settings = {
    id: 1,
    intro_text: '',
    agent_name: 'Justin Nelson',
    agent_title: 'Boston Realtor',
    agent_image: 'https://www.realtorpal.hocud.com/wp-content/uploads/Realtor-Pal-Main-Agent-pro.png',
    facebook_url: '#',
    twitter_url: '#',
    instagram_url: '#',
    linkedin_url: '#',
    is_active: true
  }
}: ContactFormSectionProps) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    inquiry_type: 'buying',
    location: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/leads/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name:   form.first_name,
          last_name:    form.last_name,
          email:        form.email,
          phone:        form.phone,
          inquiry_type: INQUIRY_MAP[form.inquiry_type] || 'GENERAL',
          location:     form.location,
          subject:      form.subject,
          message:      form.message,
          source:       'CONTACT_FORM',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(JSON.stringify(data));
      }

      setSubmitted(true);
      setForm({ first_name: '', last_name: '', email: '', phone: '', inquiry_type: 'buying', location: '', subject: '', message: '' });
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const socialLinks = [
    { Icon: FaFacebookF, href: settings.facebook_url },
    { Icon: FaTwitter, href: settings.twitter_url },
    { Icon: FaInstagram, href: settings.instagram_url },
    { Icon: FaLinkedinIn, href: settings.linkedin_url },
  ];

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row shadow-2xl rounded-sm overflow-hidden">

          {/* Left Column - Agent Info & Image */}
          <div className="w-full lg:w-[40%] bg-[#fdfaf3] p-8 sm:p-10 lg:p-12 pb-0 flex flex-col items-center">
            <div className="text-center mb-8 w-full">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-2 px-4 break-words">
                {settings.agent_name} <span className="text-[#d4af37] mx-2">|</span> {settings.agent_title}
              </h2>

              {/* Social Icons */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6">
                {socialLinks.map(({ Icon, href }, idx) => (
                  <a
                    key={idx}
                    href={href}
                    aria-label={`Social media link ${idx + 1}`}
                    className="w-11 h-11 sm:w-12 sm:h-12 bg-[#5d6d87] rounded-sm flex items-center justify-center text-white hover:bg-[#c1a478] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Icon size={18} className="sm:w-5 sm:h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Agent Image */}
            <div className="mt-auto w-full flex justify-center">
              <img
                src={settings.agent_image}
                alt={settings.agent_name}
                className="w-full max-w-[350px] sm:max-w-[450px] lg:max-w-[500px] h-auto object-contain object-bottom"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="w-full lg:w-[60%] bg-white p-8 sm:p-10 lg:p-12 xl:p-16 pb-0 border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col">

            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 sm:py-16 lg:py-20">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#c1a478]/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#c1a478]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-3">Message Sent!</h3>
                <p className="text-sm sm:text-base text-[#5d6d87] mb-8 px-4">Thank you for reaching out. We will get back to you within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full sm:w-auto py-3 px-8 bg-[#c1a478] hover:bg-[#b09367] text-white font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 rounded-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="space-y-5 sm:space-y-6 flex flex-col flex-1" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#5d6d87]">First Name</label>
                    <input
                      type="text" name="first_name" value={form.first_name}
                      onChange={handleChange} required
                      className="w-full px-4 py-3 sm:py-4 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm text-base"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#5d6d87]">Last Name</label>
                    <input
                      type="text" name="last_name" value={form.last_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 sm:py-4 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#5d6d87]">Email Address</label>
                    <input
                      type="email" name="email" value={form.email}
                      onChange={handleChange} required
                      className="w-full px-4 py-3 sm:py-4 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm text-base"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#5d6d87]">Phone Number</label>
                    <input
                      type="tel" name="phone" value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 sm:py-4 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#5d6d87]">Inquiry Reason</label>
                    <select
                      name="inquiry_type" value={form.inquiry_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 sm:py-4 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm appearance-none cursor-pointer text-base"
                    >
                      <option value="buying">Buying</option>
                      <option value="selling">Selling</option>
                      <option value="renting">Renting</option>
                      <option value="home-loan">Home Loan</option>
                        <option value="home-loan">General</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#5d6d87]">Your Location</label>
                    <input
                      type="text" name="location" value={form.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 sm:py-4 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm text-base"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#5d6d87]">Subject</label>
                  <input
                    type="text" name="subject" value={form.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-4 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm text-base"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#5d6d87]">Message</label>
                  <textarea
                    name="message" value={form.message}
                    onChange={handleChange} required rows={6}
                    className="w-full px-4 py-3 sm:py-4 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm resize-none text-base"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <div className="flex-1"></div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 sm:py-5 bg-[#c1a478] hover:bg-[#b09367] text-white font-bold text-sm sm:text-base tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:shadow-lg rounded-none transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none min-h-[52px] sm:min-h-[56px]"
                >
                  {submitting ? 'Sending...' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
