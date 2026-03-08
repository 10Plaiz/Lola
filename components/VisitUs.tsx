import React from 'react';
import { MapPin, Phone, Clock, Mail, Instagram, Facebook } from 'lucide-react';

const VisitUs: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-coffee-900 mb-4">Visit Us</h1>
          <p className="text-coffee-700 text-lg max-w-2xl mx-auto">
            Experience the heritage and warmth of Lola's by Kape Garahe in person. 
            We're located in the heart of the city, ready to serve you your favorite brew.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Map Section */}
          <div className="bg-white p-4 rounded-3xl shadow-xl border border-coffee-100 overflow-hidden h-[500px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.89641893623!2d120.96635647642609!3d14.661819239068718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b5003d90c461%3A0xc76860733eb8e8b!2sLola%E2%80%99s%20by%20Kape%20Garahe!5e0!3m2!1sen!2sph!4v1771657765616!5m2!1sen!2sph" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Lola's by Kape Garahe Location"
              className="rounded-2xl"
            ></iframe>
          </div>

          {/* Info Section */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-coffee-100">
              <h2 className="text-2xl font-serif font-bold text-coffee-900 mb-6">Location & Contact</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-coffee-100 p-3 rounded-2xl text-coffee-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-coffee-900">Our Address</h4>
                    <p className="text-coffee-700">123 Heritage Street, Barangay San Lorenzo, Makati City, 1223 Metro Manila</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-coffee-100 p-3 rounded-2xl text-coffee-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-coffee-900">Opening Hours</h4>
                    <p className="text-coffee-700">Monday - Sunday: 5:00 PM - 3:00 AM</p>
                    <p className="text-xs text-coffee-500 mt-1 italic">*Perfect for late-night coffee lovers and early risers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-coffee-100 p-3 rounded-2xl text-coffee-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-coffee-900">Phone</h4>
                    <p className="text-coffee-700">+63 917 555 0123</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-coffee-100 p-3 rounded-2xl text-coffee-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-coffee-900">Email</h4>
                    <p className="text-coffee-700">hello@lolasbykapegarahe.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-coffee-900 p-8 rounded-3xl shadow-lg text-white">
              <h2 className="text-2xl font-serif font-bold mb-6">Follow Our Journey</h2>
              <p className="text-coffee-200 mb-6">Stay updated with our latest brews, events, and stories on social media.</p>
              <div className="flex gap-4">
                <a href="#" className="bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all">
                  <Instagram size={24} />
                </a>
                <a href="#" className="bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all">
                  <Facebook size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitUs;
