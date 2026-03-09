import React from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '../types';

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Maria Santos",
    role: "Freelancer",
    comment: "The Spanish Latte reminds me so much of my childhood breakfasts. The ambiance is perfect for working remotely.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "James Reyes",
    role: "Cyclist",
    comment: "Best stop after a morning ride. The outdoor seating is spacious, and the Barako brew hits the spot.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Sarah Lee",
    role: "Student",
    comment: "Lola's Ube Latte is aesthetic and delicious! Plus the staff are super friendly. 10/10 recommend.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-coffee-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-coffee-300 font-sans font-bold uppercase tracking-widest text-sm mb-2">Community Love</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-white">What They Say</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-coffee-800/50 p-8 rounded-2xl border border-coffee-700 hover:bg-coffee-800 transition-colors">
              <div className="flex space-x-1 text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-coffee-100 text-lg italic mb-6 leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-coffee-500 mr-4" />
                <div>
                  <h4 className="font-bold text-white font-serif">{t.name}</h4>
                  <span className="text-coffee-400 text-sm">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;