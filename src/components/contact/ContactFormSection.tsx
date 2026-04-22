'use client';

import { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const INQUIRY_MAP: Record<string, string> = {
  buying:    'BUYING',
  selling:   'SELLING',
  renting:   'RENTING',
  'home-loan': 'HOME_LOAN',
};

export default function ContactFormSection() {
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

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row shadow-2xl rounded-sm overflow-hidden min-h-[800px]">

          {/* Left Column - Agent Info & Image */}
          <div className="w-full lg:w-[40%] bg-[#fdfaf3] p-12 flex flex-col items-center">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2 px-4 whitespace-nowrap">
                Justin Nelson <span className="text-[#d4af37] mx-2">|</span> Boston Realtor
              </h2>

              {/* Social Icons */}
              <div className="flex items-center justify-center gap-4 mt-6">
                {[
                  { Icon: FaFacebookF, href: '#' },
                  { Icon: FaTwitter,   href: '#' },
                  { Icon: FaInstagram, href: '#' },
                  { Icon: FaLinkedinIn, href: '#' },
                ].map(({ Icon, href }, idx) => (
                  <a
                    key={idx}
                    href={href}
                    className="w-10 h-10 bg-[#5d6d87] rounded-sm flex items-center justify-center text-white hover:bg-[#c1a478] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Agent Image */}
            <div className="mt-auto w-full flex justify-center">
              <img
                src="https://www.realtorpal.hocud.com/wp-content/uploads/Realtor-Pal-Main-Agent-pro.png"
                alt="Justin Nelson"
                className="w-full max-w-[400px] h-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="w-full lg:w-[60%] bg-white p-12 lg:p-16 border-t lg:border-t-0 lg:border-l border-gray-100">

            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-16 h-16 bg-[#c1a478]/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-[#c1a478]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a1a] mb-3">Message Sent!</h3>
                <p className="text-[#5d6d87] mb-8">Thank you for reaching out. We will get back to you within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="py-3 px-8 bg-[#c1a478] hover:bg-[#b09367] text-white font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 rounded-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#5d6d87]">First Name</label>
                    <input
                      type="text" name="first_name" value={form.first_name}
                      onChange={handleChange} required
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#5d6d87]">Last Name</label>
                    <input
                      type="text" name="last_name" value={form.last_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#5d6d87]">Email Address</label>
                    <input
                      type="email" name="email" value={form.email}
                      onChange={handleChange} required
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#5d6d87]">Phone Number</label>
                    <input
                      type="tel" name="phone" value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#5d6d87]">Inquiry Reason</label>
                    <select
                      name="inquiry_type" value={form.inquiry_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm appearance-none cursor-pointer"
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
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#5d6d87]">Subject</label>
                  <input
                    type="text" name="subject" value={form.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#5d6d87]">Message</label>
                  <textarea
                    name="message" value={form.message}
                    onChange={handleChange} required rows={6}
                    className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#c1a478] hover:bg-[#b09367] text-white font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:shadow-lg rounded-sm mt-4 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
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
