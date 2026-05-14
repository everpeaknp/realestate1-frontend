'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './LeadForm.module.css';

interface LeadFormProps {
  type: 'contact' | 'valuation';
  title?: string;
  subtitle?: string;
}

export default function LeadForm({ type, title, subtitle }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    address: '',
    sqft: '',
    condition: 'good'
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:5001/api/v1/leads/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          type: type,
          propertyAddress: formData.address,
          valuationDetails: {
            squareFootage: formData.sqft ? Number(formData.sqft) : undefined,
            condition: formData.condition,
            additionalNotes: formData.message
          },
          source: 'website_form'
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '', email: '', phone: '', message: '', 
          address: '', sqft: '', condition: 'good'
        });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.success}>
        <CheckCircle2 size={48} color="var(--color-surface-muted)" />
        <h3>Inquiry Sent!</h3>
        <p>Thank you for reaching out. An agent will contact you shortly.</p>
        <button onClick={() => setStatus('idle')} className="btn btn-primary">Send Another</button>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      {title && <h2 className={styles.formTitle}>{title}</h2>}
      {subtitle && <p className={styles.formSubtitle}>{subtitle}</p>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input 
            type="text" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Your full name"
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="you@example.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="(123) 456-7890"
            />
          </div>
        </div>

        {type === 'valuation' && (
          <>
            <div className={styles.formGroup}>
              <label>Property Address</label>
              <input 
                type="text" 
                required 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Where is your home located?"
              />
            </div>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Estimated Square Footage</label>
                <input 
                  type="number" 
                  value={formData.sqft}
                  onChange={(e) => setFormData({...formData, sqft: e.target.value})}
                  placeholder="e.g. 2500"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Home Condition</label>
                <select 
                  value={formData.condition}
                  onChange={(e) => setFormData({...formData, condition: e.target.value})}
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Needs Work</option>
                  <option value="poor">Major Repair</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className={styles.formGroup}>
          <label>{type === 'valuation' ? 'Additional Notes' : 'Message'}</label>
          <textarea 
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            placeholder={type === 'valuation' ? 'Mention any recent upgrades or special features...' : 'How can we help you?'}
          ></textarea>
        </div>

        {status === 'error' && (
          <div className={styles.error}>
            <AlertCircle size={18} />
            There was an error sending your message. Please try again.
          </div>
        )}

        <button 
          type="submit" 
          className={`btn btn-primary ${styles.submitBtn}`}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : (
            <>
              <Send size={18} /> {type === 'valuation' ? 'Get My Valuation' : 'Send Message'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
