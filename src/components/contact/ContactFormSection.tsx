'use client';

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';


export default function ContactFormSection() {
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
                  { Icon: FaTwitter, href: '#' },
                  { Icon: FaInstagram, href: '#' },
                  { Icon: FaLinkedinIn, href: '#' }
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
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#5d6d87]">First Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm"
                  />
                </div>
                {/* Last Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#5d6d87]">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#5d6d87]">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm"
                  />
                </div>
                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#5d6d87]">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inquiry Reason */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#5d6d87]">Inquiry Reason</label>
                  <select className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm appearance-none cursor-pointer">
                    <option value="buying">Buying</option>
                    <option value="selling">Selling</option>
                    <option value="renting">Renting</option>
                    <option value="home-loan">Home Loan</option>
                  </select>
                </div>
                {/* Your Location */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#5d6d87]">Your Location</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#5d6d87]">Subject</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#5d6d87]">Message</label>
                <textarea 
                  rows={6}
                  className="w-full px-4 py-3 bg-[#f9f9f9] border border-gray-200 focus:border-[#c1a478] outline-none transition-colors rounded-sm resize-none"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full py-4 bg-[#c1a478] hover:bg-[#b09367] text-white font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:shadow-lg rounded-sm mt-4 transform hover:-translate-y-0.5"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
