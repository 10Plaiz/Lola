import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Order, OrderItem } from '../types';
import { Package, Clock, CheckCircle, XCircle, CreditCard, Banknote, FileText, X, MessageSquare, PhoneCall, Truck } from 'lucide-react';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/user/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const viewReceipt = async (orderId: string) => {
    try {
      const res = await fetch(`/api/receipts/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedReceipt(data);
      } else {
        alert('Receipt not found or not yet generated.');
      }
    } catch (err) {
      console.error('Failed to fetch receipt', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="text-amber-500" size={20} />;
      case 'accepted': return <Package className="text-blue-500" size={20} />;
      case 'completed': return <CheckCircle className="text-emerald-500" size={20} />;
      case 'cancelled': return <XCircle className="text-red-500" size={20} />;
      default: return null;
    }
  };

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-coffee-900 mb-2">Welcome back, {user?.username}!</h1>
          <p className="text-coffee-700">Manage your orders and view your coffee journey with us.</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Order History */}
          <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-coffee-50 bg-coffee-50/30 flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-coffee-900">Order History</h2>
              <span className="text-sm text-coffee-600 font-medium">{orders.length} Orders</span>
            </div>
            
            <div className="divide-y divide-coffee-50">
              {loading ? (
                <div className="p-12 text-center text-coffee-400">Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center">
                  <Package size={48} className="mx-auto text-coffee-200 mb-4" />
                  <p className="text-coffee-600">You haven't placed any orders yet.</p>
                  <a href="/menu" className="inline-block mt-4 text-coffee-600 font-bold hover:underline">Browse our menu</a>
                </div>
              ) : (
                orders.map((order) => {
                  const rider = order.riderInfo ? JSON.parse(order.riderInfo) : null;
                  return (
                    <div key={order.id} className="p-6 hover:bg-coffee-50/20 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-mono font-bold text-coffee-500">{order.id}</span>
                            <span className="text-xs text-coffee-400">•</span>
                            <span className="text-xs text-coffee-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="text-sm font-bold capitalize text-coffee-800">{order.status}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-coffee-900">{order.total}</div>
                          <div className="flex items-center justify-end gap-1 text-xs text-coffee-500 mb-2">
                            {order.paymentMethod === 'gcash' ? <CreditCard size={12} /> : <Banknote size={12} />}
                            <span className="uppercase">{order.paymentMethod}</span>
                            {order.gcashNumber && <span className="opacity-60">({order.gcashNumber})</span>}
                          </div>
                          {order.receiptGenerated && (
                            <button 
                              onClick={() => viewReceipt(order.id)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors"
                            >
                              <FileText size={14} /> View Receipt
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Rider Info Section */}
                      {rider && (
                        <div className="mb-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                              <Truck size={24} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Grab Delivery Rider Assigned</p>
                              <h4 className="font-bold text-slate-900">{rider.name} • <span className="text-blue-700">{rider.plate}</span></h4>
                              <p className="text-xs text-slate-500">{rider.type}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full md:w-auto">
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all">
                              <MessageSquare size={16} /> Message
                            </button>
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md">
                              <PhoneCall size={16} /> Call
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="bg-coffee-50/50 rounded-xl p-4">
                        <ul className="space-y-2">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm">
                              <span className="text-coffee-800">
                                <span className="font-bold text-coffee-600">{item.quantity}x</span> {item.name}
                              </span>
                              <span className="text-coffee-600">{item.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-coffee-900/60 backdrop-blur-sm" onClick={() => setSelectedReceipt(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="bg-purple-600 p-6 text-white text-center relative">
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-4 right-4 text-purple-200 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-serif font-bold">Official Receipt</h2>
              <p className="text-purple-100 text-sm">Thank you for your purchase!</p>
            </div>
            <div className="p-8 space-y-6 font-mono text-sm">
              <div className="border-b border-dashed border-slate-200 pb-4 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt ID:</span>
                  <span className="font-bold">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-bold">{selectedReceipt.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-bold">{new Date(selectedReceipt.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-bold uppercase text-xs text-slate-400">Items</p>
                {selectedReceipt.content.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{selectedReceipt.content.total}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Payment Method:</span>
                  <span className="uppercase">{selectedReceipt.content.paymentMethod}</span>
                </div>
              </div>

              <div className="text-center pt-6">
                <p className="text-xs text-slate-400 italic">Lola's by Kape Garahe</p>
                <p className="text-[10px] text-slate-300">123 Heritage Street, Makati City</p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => window.print()}
                className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-white transition-all shadow-sm"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
