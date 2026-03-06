import React from 'react';
import { FAVORITE_ITEMS } from '../data/menuData';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Menu: React.FC = () => {
  const { user } = useAuth();
  return (
    <section id="menu" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-coffee-600 font-sans font-bold uppercase tracking-widest text-sm mb-2">Our Favorites</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-coffee-900">Curated Menu</h3>
          <div className="h-1 w-20 bg-coffee-500 mx-auto mt-6 rounded-full"></div>
          <p className="mt-6 text-coffee-700 max-w-2xl mx-auto">
            A selection of our most loved drinks, handpicked by Lola herself.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FAVORITE_ITEMS.map((item) => (
            <div key={item.id} className="group bg-cream rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-coffee-100">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-coffee-900 font-bold px-3 py-1 rounded-full shadow-sm">
                  {item.price}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-serif font-bold text-coffee-900 group-hover:text-coffee-600 transition-colors">{item.name}</h4>
                  <span className="text-xs font-semibold text-coffee-500 bg-coffee-100 px-2 py-1 rounded-md">{item.category}</span>
                </div>
                <p className="text-coffee-700 text-sm leading-relaxed mb-4">{item.description}</p>
                {user?.role !== 'admin' && (
                  <button className="w-full py-2 border border-coffee-300 text-coffee-800 rounded-lg hover:bg-coffee-600 hover:text-white hover:border-transparent transition-all font-medium text-sm uppercase tracking-wide">
                    Add to Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
           <Link 
             to="/menu" 
             className="inline-flex items-center px-8 py-4 bg-coffee-600 text-white rounded-full font-bold hover:bg-coffee-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
           >
             View Full Menu
           </Link>
        </div>
      </div>
    </section>
  );
};

export default Menu;
