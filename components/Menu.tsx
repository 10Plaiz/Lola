import React, { useState } from 'react';
import { MenuItem } from '../types';

const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "Classic Barako",
    description: "Bold, intense, and smoky. The classic Batangas brew.",
    price: "$3.50",
    category: "Coffee",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Spanish Latte",
    description: "Espresso with condensed milk. Sweet, creamy, and comforting.",
    price: "$4.50",
    category: "Coffee",
    imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Ube Latte",
    description: "A purple yam delight. Earthy, sweet, and uniquely Filipino.",
    price: "$5.00",
    category: "Coffee",
    imageUrl: "https://images.unsplash.com/photo-1632057997868-b7c1918a227d?auto=format&fit=crop&q=80&w=400" 
  },
  {
    id: 4,
    name: "Bibingka Cheesecake",
    description: "Salted egg cheesecake on a banana leaf. A savory-sweet masterpiece.",
    price: "$6.00",
    category: "Pastry",
    imageUrl: "https://images.unsplash.com/photo-1567327613485-fbc7bf196191?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    name: "Tablea Hot Choco",
    description: "Rich, thick chocolate made from pure cacao tablets.",
    price: "$4.00",
    category: "Non-Coffee",
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 6,
    name: "Ensaymada Especial",
    description: "Buttery brioche topped with grated cheese and sugar.",
    price: "$3.00",
    category: "Pastry",
    imageUrl: "https://images.unsplash.com/photo-1623150027725-b46182103328?auto=format&fit=crop&q=80&w=400"
  }
];

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const categories = ['All', 'Coffee', 'Non-Coffee', 'Pastry'];
  
  const filteredItems = activeCategory === 'All' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-coffee-600 font-sans font-bold uppercase tracking-widest text-sm mb-2">Our Favorites</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-coffee-900">Curated Menu</h3>
          <div className="h-1 w-20 bg-coffee-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-coffee-600 text-white shadow-lg scale-105' 
                  : 'bg-coffee-50 text-coffee-800 hover:bg-coffee-100 hover:text-coffee-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
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
                <button className="w-full py-2 border border-coffee-300 text-coffee-800 rounded-lg hover:bg-coffee-600 hover:text-white hover:border-transparent transition-all font-medium text-sm uppercase tracking-wide">
                  Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
           <a href="#" className="inline-flex items-center text-coffee-600 hover:text-coffee-800 font-bold border-b-2 border-coffee-300 hover:border-coffee-600 pb-1 transition-all">
             View Full Menu
           </a>
        </div>
      </div>
    </section>
  );
};

export default Menu;