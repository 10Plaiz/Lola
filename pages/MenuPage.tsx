import React, { useState } from 'react';
import { FULL_MENU } from '../data/menuData';
import { Coffee, ArrowLeft, ShoppingCart, Trash2, X, CreditCard, Banknote } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MenuItem, OrderItem } from '../types';

const MenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'cash'>('cash');
  const [gcashNumber, setGcashNumber] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const categories = [
    'All', 
    'Coffee', 
    'Non-Coffee', 
    'Refreshers', 
    'Sea Salt Series', 
    'Matcha Series', 
    'Barista Drink', 
    'Add-ons'
  ];
  
  const filteredItems = activeCategory === 'All' 
    ? FULL_MENU 
    : FULL_MENU.filter(item => item.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    if (user?.role === 'admin') return;
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => {
    const price = parseInt(item.price.replace('₱', ''));
    return acc + (price * item.quantity);
  }, 0);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please sign in to place an order');
      return;
    }
    if (paymentMethod === 'gcash' && !gcashNumber) {
      alert('Please enter your GCash number');
      return;
    }

    setIsOrdering(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: `₱${cartTotal}`,
          paymentMethod,
          gcashNumber: paymentMethod === 'gcash' ? gcashNumber : undefined
        })
      });

      if (res.ok) {
        setCart([]);
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        navigate('/dashboard');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to place order');
      }
    } catch (err) {
      console.error('Checkout error', err);
      alert('An error occurred during checkout');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link to="/" className="inline-flex items-center text-coffee-600 hover:text-coffee-800 font-medium mb-6 transition-colors">
              <ArrowLeft size={20} className="mr-2" /> Back to Home
            </Link>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-coffee-900 mb-4">Our Full Menu</h1>
            <p className="text-coffee-700 text-lg max-w-2xl">
              From our signature Barako blends to our refreshing fruit sodas, discover the perfect drink crafted with love by Lola.
            </p>
          </div>
          {user?.role !== 'admin' && (
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-4 bg-white rounded-2xl shadow-md border border-coffee-100 text-coffee-600 hover:text-coffee-800 transition-all group"
            >
              <ShoppingCart size={28} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-coffee-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  {cart.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="sticky top-20 z-30 bg-cream/80 backdrop-blur-md py-4 mb-12 -mx-4 px-4 overflow-x-auto no-scrollbar">
          <div className="flex space-x-3 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-coffee-600 text-white shadow-lg scale-105' 
                    : 'bg-white text-coffee-800 hover:bg-coffee-100 border border-coffee-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-coffee-50 flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-coffee-900 font-bold px-3 py-1 rounded-full shadow-sm text-sm">
                  {item.price}
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <div className="mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-coffee-500 bg-coffee-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                    {item.category}
                  </span>
                  <h4 className="text-lg font-serif font-bold text-coffee-900 group-hover:text-coffee-600 transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                </div>
                <p className="text-coffee-700 text-xs leading-relaxed mb-4 line-clamp-2 flex-grow">
                  {item.description}
                </p>
                {user?.role !== 'admin' && (
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full py-2 bg-coffee-50 text-coffee-800 rounded-lg hover:bg-coffee-600 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
                  >
                    Add to Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cart Sidebar */}
        {isCartOpen && user?.role !== 'admin' && (
          <div className="fixed inset-0 z-[100] overflow-hidden">
            <div className="absolute inset-0 bg-coffee-900/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
                <div className="p-6 border-b border-coffee-50 flex justify-between items-center bg-coffee-600 text-white">
                  <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                    <ShoppingCart size={24} /> Your Order
                  </h2>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-20">
                      <ShoppingCart size={48} className="mx-auto text-coffee-100 mb-4" />
                      <p className="text-coffee-500 font-medium">Your cart is empty</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="flex-1">
                          <h4 className="font-bold text-coffee-900">{item.name}</h4>
                          <p className="text-sm text-coffee-500">{item.price}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-coffee-50 px-3 py-1 rounded-full">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-coffee-600 font-bold">-</button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-coffee-600 font-bold">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-6 border-t border-coffee-50 bg-coffee-50/30 space-y-4">
                    <div className="flex justify-between items-center text-lg font-bold text-coffee-900">
                      <span>Total</span>
                      <span>₱{cartTotal}</span>
                    </div>
                    <button 
                      onClick={() => setIsCheckoutOpen(true)}
                      className="w-full py-4 bg-coffee-600 text-white rounded-2xl font-bold shadow-lg hover:bg-coffee-700 transition-all transform hover:-translate-y-0.5"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {isCheckoutOpen && user?.role !== 'admin' && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-coffee-900/60 backdrop-blur-md" onClick={() => setIsCheckoutOpen(false)}></div>
            <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
              <div className="bg-coffee-600 p-6 text-white text-center">
                <h2 className="text-2xl font-serif font-bold">Complete Your Order</h2>
                <p className="text-coffee-100 text-sm">Choose your preferred payment method</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-coffee-700 uppercase tracking-widest">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPaymentMethod('gcash')}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'gcash' ? 'border-coffee-600 bg-coffee-50' : 'border-slate-100 hover:border-coffee-200'}`}
                    >
                      <CreditCard size={24} className={paymentMethod === 'gcash' ? 'text-coffee-600' : 'text-slate-400'} />
                      <span className={`font-bold text-sm ${paymentMethod === 'gcash' ? 'text-coffee-900' : 'text-slate-500'}`}>GCash</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'cash' ? 'border-coffee-600 bg-coffee-50' : 'border-slate-100 hover:border-coffee-200'}`}
                    >
                      <Banknote size={24} className={paymentMethod === 'cash' ? 'text-coffee-600' : 'text-slate-400'} />
                      <span className={`font-bold text-sm ${paymentMethod === 'cash' ? 'text-coffee-900' : 'text-slate-500'}`}>Cash on Pickup</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'gcash' && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-xs font-bold text-coffee-700 uppercase tracking-widest ml-1">GCash Number</label>
                    <input 
                      type="tel" 
                      placeholder="0917 XXX XXXX"
                      value={gcashNumber}
                      onChange={(e) => setGcashNumber(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    />
                    <p className="text-[10px] text-coffee-500 italic">Lola's GCash: 0917 888 9999 (Please pay before pickup)</p>
                  </div>
                )}

                <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-slate-600">Total to Pay</span>
                  <span className="text-2xl font-bold text-coffee-900">₱{cartTotal}</span>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsCheckoutOpen(false)}
                    className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCheckout}
                    disabled={isOrdering}
                    className="flex-2 py-4 bg-coffee-600 text-white rounded-2xl font-bold shadow-lg hover:bg-coffee-700 transition-all disabled:opacity-50"
                  >
                    {isOrdering ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
