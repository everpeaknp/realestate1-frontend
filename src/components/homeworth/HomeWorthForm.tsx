'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Mail, Phone, User, MapPin, DollarSign } from 'lucide-react';

export default function HomeWorthForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    propertyType: '',
    budget: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      
      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const response = await fetch(`${apiUrl}/api/leads/valuation/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message || 'Home valuation request',
          property_type_interest: formData.propertyType,
          budget: formData.budget,
          location: formData.address,
          inquiry_type: 'SELLING',
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          propertyType: '',
          budget: '',
          message: '',
        });
      } else {
        const errorData = await response.json();
        console.error('Validation errors:', errorData);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="valuation-form" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">
            Request Your Free Home Valuation
          </h2>
          <p className="text-lg text-[#7C7A70] max-w-2xl mx-auto">
            Fill out the form below and I&apos;ll provide you with a comprehensive market analysis of your property.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-[#5d6d87] mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c1a478]" size={18} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#c1a478] transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-[#5d6d87] mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c1a478]" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#c1a478] transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-[#5d6d87] mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c1a478]" size={18} />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#c1a478] transition-colors"
                  placeholder="+1 (321) 456-7890"
                />
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label htmlFor="propertyType" className="block text-sm font-bold text-[#5d6d87] mb-2">
                Property Type *
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c1a478]" size={18} />
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#c1a478] transition-colors appearance-none bg-white"
                >
                  <option value="">Select Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <label htmlFor="address" className="block text-sm font-bold text-[#5d6d87] mb-2">
              Property Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-[#c1a478]" size={18} />
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#c1a478] transition-colors"
                placeholder="123 Main Street, Boston, MA 02101"
              />
            </div>
          </div>

          {/* Budget (Optional) */}
          <div className="mb-6">
            <label htmlFor="budget" className="block text-sm font-bold text-[#5d6d87] mb-2">
              Expected Price Range (Optional)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c1a478]" size={18} />
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#c1a478] transition-colors"
                placeholder="$500,000 - $750,000"
              />
            </div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <label htmlFor="message" className="block text-sm font-bold text-[#5d6d87] mb-2">
              Additional Information (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#c1a478] transition-colors resize-none"
              placeholder="Tell us more about your property or any specific questions you have..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#c1a478] hover:bg-[#b09367] text-white px-12 py-4 font-bold text-sm tracking-widest transition-all rounded-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'SUBMITTING...' : 'GET FREE VALUATION'}
          </button>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 border border-green-200 rounded-sm text-green-800 text-center"
            >
              Thank you! Your valuation request has been submitted. We&apos;ll contact you shortly.
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-800 text-center"
            >
              Something went wrong. Please try again or contact us directly.
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
}
