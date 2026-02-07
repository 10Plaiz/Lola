import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80" 
          alt="Cozy Coffee Shop" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-coffee-900/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <span className="inline-block py-1 px-3 rounded-full bg-coffee-100/20 backdrop-blur-sm text-cream border border-cream/30 mb-6 text-sm font-semibold tracking-wider uppercase animate-fade-in-up">
          Est. 2021 &bull; The Original Garage Cafe
        </span>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
          Taste the Warmth <br/> of <span className="text-coffee-200 italic">Home</span>
        </h1>
        <p className="text-lg md:text-xl text-coffee-100 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
          Where every cup is brewed with the nostalgia of Lola's kitchen and the artisanal spirit of a garage workshop.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#menu" 
            className="px-8 py-4 bg-coffee-600 text-white rounded-full font-semibold text-lg hover:bg-coffee-500 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            View Our Menu
          </a>
          <a 
            href="#about" 
            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/40 rounded-full font-semibold text-lg hover:bg-white/20 transition-all"
          >
            Our Story
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-coffee-800 opacity-70">
        <ChevronDown size={32} />
      </div>
    </section>
  );
};

export default Hero;