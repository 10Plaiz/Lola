import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Image Grid */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-coffee-200 rounded-full z-0 opacity-50"></div>
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Pour over coffee" 
                className="rounded-2xl shadow-xl w-full h-64 object-cover transform translate-y-8"
              />
              <img 
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Coffee beans" 
                className="rounded-2xl shadow-xl w-full h-64 object-cover"
              />
            </div>
             <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-coffee-500/10 rounded-full z-0"></div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-coffee-600 font-sans font-bold uppercase tracking-widest text-sm">Our Origin</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-coffee-900 leading-tight">
              From a Garage to <br /> <span className="text-coffee-500">Lola's Heart</span>
            </h3>
            <p className="text-coffee-800 text-lg leading-relaxed opacity-80">
              It started with a simple espresso machine in an old family garage. We wanted to bring back the slow mornings we spent with our Lola (Grandmother), sipping Barako coffee while listening to her stories.
            </p>
            <p className="text-coffee-800 text-lg leading-relaxed opacity-80">
              Today, <strong>Lola's by Kape Garahe</strong> is a tribute to heritage and craft. We source our beans locally from Batangas and the Cordilleras, roasting them to highlight the sweet, bold notes that remind us of home.
            </p>
            
            <div className="pt-4 flex items-center space-x-4">
              <div className="flex flex-col">
                <span className="text-3xl font-serif font-bold text-coffee-600">100%</span>
                <span className="text-sm text-coffee-700 uppercase tracking-wider">Locally Sourced</span>
              </div>
              <div className="h-10 w-px bg-coffee-300"></div>
               <div className="flex flex-col">
                <span className="text-3xl font-serif font-bold text-coffee-600">20+</span>
                <span className="text-sm text-coffee-700 uppercase tracking-wider">Unique Blends</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;