import React, { useEffect, useState } from 'react';
import { Order, InventoryItem, Staff, Vendor, ProductStat } from '../types';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  BarChart3, 
  AlertTriangle, 
  Check, 
  CheckCircle,
  X, 
  Clock,
  TrendingUp,
  Users,
  Coffee,
  FileText,
  Truck,
  UserPlus,
  Trash2,
  Calendar,
  Phone,
  Plus
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [productStats, setProductStats] = useState<ProductStat[]>([]);
  const [analytics, setAnalytics] = useState({ 
    totalRevenue: 0, 
    totalOrders: 0, 
    pendingOrders: 0,
    topProducts: [] as { name: string, sales: number }[],
    totalCustomers: 0,
    lowStockCount: 0,
    dailyRevenue: [] as { date: string, revenue: number }[]
  });
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'analytics' | 'staff' | 'vendors' | 'products'>('orders');
  const [loading, setLoading] = useState(true);

  // Form states
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({ name: '', role: '', phone: '', schedule: {} });
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({ name: '', contactPerson: '', phone: '', itemsToBuy: [] });

  const fetchData = async () => {
    try {
      const [ordersRes, invRes, anaRes, staffRes, vendorsRes, statsRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/inventory'),
        fetch('/api/admin/analytics'),
        fetch('/api/admin/staff'),
        fetch('/api/admin/vendors'),
        fetch('/api/admin/product-stats')
      ]);
      
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (invRes.ok) setInventory(await invRes.json());
      if (anaRes.ok) setAnalytics(await anaRes.json());
      if (staffRes.ok) setStaff(await staffRes.json());
      if (vendorsRes.ok) setVendors(await vendorsRes.json());
      if (statsRes.ok) setProductStats(await statsRes.json());
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateReceipt = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/generate-receipt`, {
        method: 'POST'
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Failed to generate receipt', err);
    }
  };

  const finishOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/finish`, {
        method: 'POST'
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Failed to finish order', err);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Failed to update order', err);
    }
  };

  const updateStock = async (id: number, currentStock: number, change: number) => {
    try {
      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: Math.max(0, currentStock + change) })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Failed to update inventory', err);
    }
  };

  const handleAddStaff = async () => {
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
      if (res.ok) {
        setShowStaffModal(false);
        setNewStaff({ name: '', role: '', phone: '', schedule: {} });
        fetchData();
      }
    } catch (err) {
      console.error('Failed to add staff', err);
    }
  };

  const handleDeleteStaff = async (id: number) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    try {
      const res = await fetch(`/api/admin/staff/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Failed to delete staff', err);
    }
  };

  const handleAddVendor = async () => {
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVendor)
      });
      if (res.ok) {
        setShowVendorModal(false);
        setNewVendor({ name: '', contactPerson: '', phone: '', itemsToBuy: [] });
        fetchData();
      }
    } catch (err) {
      console.error('Failed to add vendor', err);
    }
  };

  const handleDeleteVendor = async (id: number) => {
    if (!confirm('Are you sure you want to remove this vendor?')) return;
    try {
      const res = await fetch(`/api/admin/vendors/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Failed to delete vendor', err);
    }
  };

  if (loading) return <div className="pt-32 text-center text-coffee-600">Loading Dashboard...</div>;

  return (
    <div className="pt-20 min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-coffee-900 text-white p-6 space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-coffee-500 p-2 rounded-lg">
            <Coffee size={24} />
          </div>
          <span className="font-serif font-bold text-xl">Lola's Admin</span>
        </div>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-coffee-600 shadow-lg' : 'hover:bg-white/10'}`}
          >
            <ShoppingBag size={20} /> Orders
            {analytics.pendingOrders > 0 && <span className="ml-auto bg-red-500 text-[10px] px-2 py-1 rounded-full">{analytics.pendingOrders}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'inventory' ? 'bg-coffee-600 shadow-lg' : 'hover:bg-white/10'}`}
          >
            <Package size={20} /> Inventory
            {analytics.lowStockCount > 0 && <span className="ml-auto bg-amber-500 text-[10px] px-2 py-1 rounded-full text-coffee-950 font-bold">LOW</span>}
          </button>
          <button 
            onClick={() => setActiveTab('staff')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'staff' ? 'bg-coffee-600 shadow-lg' : 'hover:bg-white/10'}`}
          >
            <Users size={20} /> Staff
          </button>
          <button 
            onClick={() => setActiveTab('vendors')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'vendors' ? 'bg-coffee-600 shadow-lg' : 'hover:bg-white/10'}`}
          >
            <Truck size={20} /> Vendors
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-coffee-600 shadow-lg' : 'hover:bg-white/10'}`}
          >
            <BarChart3 size={20} /> Product Stats
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-coffee-600 shadow-lg' : 'hover:bg-white/10'}`}
          >
            <TrendingUp size={20} /> Analytics
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><TrendingUp size={20} /></div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900">₱{analytics.totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><ShoppingBag size={20} /></div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Orders</p>
            <h3 className="text-2xl font-bold text-slate-900">{analytics.totalOrders}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Clock size={20} /></div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Pending Orders</p>
            <h3 className="text-2xl font-bold text-slate-900">{analytics.pendingOrders}</h3>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Incoming Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Order ID</th>
                    <th className="px-6 py-4 font-bold">Customer</th>
                    <th className="px-6 py-4 font-bold">Items</th>
                    <th className="px-6 py-4 font-bold">Total</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm font-bold text-coffee-600">{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900">{order.username}</div>
                        <div className="text-xs text-slate-500 uppercase">{order.paymentMethod}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-600">
                          {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">{order.total}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'accepted')}
                              className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                              title="Accept Order"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          
                          {/* Generate Receipt Button */}
                          {!order.receiptGenerated && order.status === 'accepted' && (
                            <button 
                              onClick={() => generateReceipt(order.id)}
                              className="p-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                              title="Generate Receipt"
                            >
                              <FileText size={16} />
                            </button>
                          )}

                          {/* Order Finished Button (All accepted orders) */}
                          {order.status === 'accepted' && (
                            <button 
                              onClick={() => finishOrder(order.id)}
                              className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Order Finished (Deducts Inventory)"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}

                          {order.status !== 'completed' && order.status !== 'cancelled' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Cancel Order"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                        {order.receiptGenerated && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-purple-600 font-bold uppercase">
                            <Check size={10} /> Receipt Generated
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Inventory Tracking</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventory.map((item) => (
                <div key={item.id} className={`p-6 rounded-2xl border ${item.stock <= item.minStock ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    {item.stock <= item.minStock && (
                      <div className="flex items-center gap-1 text-red-600 animate-pulse">
                        <AlertTriangle size={16} />
                        <span className="text-[10px] font-bold uppercase">Low Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Current Stock</p>
                      <p className="text-3xl font-bold text-slate-900">{item.stock}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateStock(item.id, item.stock, -1)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => updateStock(item.id, item.stock, 1)}
                        className="w-10 h-10 flex items-center justify-center bg-coffee-600 text-white rounded-xl hover:bg-coffee-700 transition-all shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${item.stock <= item.minStock ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, (item.stock / (item.minStock * 3)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Staff Management</h2>
              <button 
                onClick={() => setShowStaffModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-coffee-600 text-white rounded-xl hover:bg-coffee-700 transition-all font-bold text-sm"
              >
                <UserPlus size={18} /> Add Staff
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((s) => (
                <div key={s.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group">
                  <button 
                    onClick={() => handleDeleteStaff(s.id)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-coffee-100 text-coffee-600 rounded-full flex items-center justify-center font-bold text-xl">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{s.name}</h4>
                      <p className="text-xs text-coffee-600 font-bold uppercase">{s.role}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone size={14} /> {s.phone}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Schedule</p>
                      {Object.entries(s.schedule).map(([day, time]) => (
                        <div key={day} className="flex justify-between text-xs">
                          <span className="text-slate-500">{day}</span>
                          <span className="font-bold text-slate-700">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Vendor Directory</h2>
              <button 
                onClick={() => setShowVendorModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-coffee-600 text-white rounded-xl hover:bg-coffee-700 transition-all font-bold text-sm"
              >
                <Plus size={18} /> Add Vendor
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {vendors.map((v) => (
                <div key={v.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group">
                  <button 
                    onClick={() => handleDeleteVendor(v.id)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">{v.name}</h4>
                  <p className="text-sm text-slate-500 mb-4">Contact: {v.contactPerson} • {v.phone}</p>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grocery List / Items to Buy</p>
                    <div className="space-y-1">
                      {v.itemsToBuy.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white px-3 py-2 border border-slate-200 rounded-xl text-xs">
                          <span className="text-slate-600 font-medium">{item.name}</span>
                          <span className="bg-coffee-100 text-coffee-700 px-2 py-0.5 rounded-md font-bold">{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Product Performance</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Product Name</th>
                    <th className="px-6 py-4 font-bold">Category</th>
                    <th className="px-6 py-4 font-bold">Total Sales</th>
                    <th className="px-6 py-4 font-bold">Total Revenue</th>
                    <th className="px-6 py-4 font-bold">Last Sold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productStats.map((stat) => (
                    <tr key={stat.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{stat.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{stat.category}</td>
                      <td className="px-6 py-4 font-bold text-coffee-600">{stat.totalSales} units</td>
                      <td className="px-6 py-4 font-bold text-slate-900">₱{stat.totalRevenue.toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{new Date(stat.lastSold).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Revenue Overview (Last 7 Days)</h2>
              <div className="space-y-4">
                {analytics.dailyRevenue.length === 0 ? (
                  <div className="h-32 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">No revenue data available yet</p>
                  </div>
                ) : (
                  analytics.dailyRevenue.map((day, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                        <span>{day.date}</span>
                        <span>₱{day.revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-coffee-500 transition-all"
                          style={{ width: `${Math.min(100, (day.revenue / Math.max(1, ...analytics.dailyRevenue.map(d => d.revenue))) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Top Products</h3>
                <div className="space-y-4">
                  {analytics.topProducts.length === 0 ? (
                    <p className="text-slate-400 text-sm italic">No sales data yet</p>
                  ) : (
                    analytics.topProducts.map((p, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">{p.name}</span>
                        <span className="text-sm font-bold text-slate-900">{p.sales} units</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Customer Growth</h3>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><Users size={24} /></div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{analytics.totalCustomers}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">Total Customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-coffee-900/60 backdrop-blur-sm" onClick={() => setShowStaffModal(false)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-8 overflow-hidden">
            <h3 className="text-2xl font-serif font-bold text-coffee-900 mb-6">Add New Staff</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side: Info */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase">Staff Information</p>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
                    <input 
                      type="text" placeholder="e.g. Juan Dela Cruz" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-coffee-500 outline-none transition-all"
                      value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">Role</label>
                    <input 
                      type="text" placeholder="e.g. Head Barista" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-coffee-500 outline-none transition-all"
                      value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">Phone Number</label>
                    <input 
                      type="text" placeholder="e.g. 0917 123 4567" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-coffee-500 outline-none transition-all"
                      value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="pt-4 hidden md:block">
                  <button 
                    onClick={handleAddStaff}
                    className="w-full py-4 bg-coffee-600 text-white rounded-2xl font-bold shadow-lg hover:bg-coffee-700 transition-all"
                  >
                    Save Staff Member
                  </button>
                </div>
              </div>

              {/* Right Side: Schedule */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase">Weekly Schedule (5PM - 3AM)</p>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="w-20 text-xs font-bold text-coffee-800">{day}</span>
                      <div className="flex-1 flex items-center gap-2">
                        <select 
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-medium focus:ring-1 focus:ring-coffee-500 outline-none"
                          value={newStaff.schedule?.[day]?.split(' - ')[0] || 'Off'}
                          onChange={e => {
                            const start = e.target.value;
                            const current = newStaff.schedule?.[day] || 'Off - Off';
                            const end = current.split(' - ')[1] || 'Off';
                            setNewStaff({
                              ...newStaff, 
                              schedule: { ...newStaff.schedule, [day]: start === 'Off' ? 'Off' : `${start} - ${end}` }
                            });
                          }}
                        >
                          <option value="Off">Off</option>
                          {['5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12AM', '1AM', '2AM', '3AM'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <span className="text-[10px] text-slate-400 font-bold">TO</span>
                        <select 
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-medium focus:ring-1 focus:ring-coffee-500 outline-none"
                          value={newStaff.schedule?.[day]?.split(' - ')[1] || 'Off'}
                          onChange={e => {
                            const end = e.target.value;
                            const current = newStaff.schedule?.[day] || 'Off - Off';
                            const start = current.split(' - ')[0] || 'Off';
                            setNewStaff({
                              ...newStaff, 
                              schedule: { ...newStaff.schedule, [day]: end === 'Off' ? 'Off' : `${start} - ${end}` }
                            });
                          }}
                        >
                          <option value="Off">Off</option>
                          {['5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12AM', '1AM', '2AM', '3AM'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="md:hidden pt-4">
                  <button 
                    onClick={handleAddStaff}
                    className="w-full py-4 bg-coffee-600 text-white rounded-2xl font-bold shadow-lg hover:bg-coffee-700 transition-all"
                  >
                    Save Staff Member
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Modal */}
      {showVendorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-coffee-900/60 backdrop-blur-sm" onClick={() => setShowVendorModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-serif font-bold text-coffee-900 mb-6">Add New Vendor</h3>
            <div className="space-y-4">
              <input 
                type="text" placeholder="Vendor Name" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                value={newVendor.name} onChange={e => setNewVendor({...newVendor, name: e.target.value})}
              />
              <input 
                type="text" placeholder="Contact Person" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                value={newVendor.contactPerson} onChange={e => setNewVendor({...newVendor, contactPerson: e.target.value})}
              />
              <input 
                type="text" placeholder="Phone Number" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                value={newVendor.phone} onChange={e => setNewVendor({...newVendor, phone: e.target.value})}
              />
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 border border-slate-100 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Select Items & Quantities</p>
                {inventory.map(item => {
                  const isSelected = newVendor.itemsToBuy?.some(i => i.name === item.name);
                  const selectedItem = newVendor.itemsToBuy?.find(i => i.name === item.name);
                  
                  return (
                    <div key={item.id} className="flex items-center justify-between gap-4 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={e => {
                            const items = [...(newVendor.itemsToBuy || [])];
                            if (e.target.checked) {
                              items.push({ name: item.name, quantity: 1 });
                            } else {
                              const index = items.findIndex(i => i.name === item.name);
                              if (index > -1) items.splice(index, 1);
                            }
                            setNewVendor({ ...newVendor, itemsToBuy: items });
                          }}
                          className="w-4 h-4 rounded text-coffee-600 focus:ring-coffee-500"
                        />
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      </div>
                      {isSelected && (
                        <input 
                          type="number" 
                          min="1"
                          value={selectedItem?.quantity || 1}
                          onChange={e => {
                            const items = [...(newVendor.itemsToBuy || [])];
                            const index = items.findIndex(i => i.name === item.name);
                            if (index > -1) {
                              items[index].quantity = parseInt(e.target.value) || 1;
                              setNewVendor({ ...newVendor, itemsToBuy: items });
                            }
                          }}
                          className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm text-center"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <button 
                onClick={handleAddVendor}
                className="w-full py-4 bg-coffee-600 text-white rounded-2xl font-bold shadow-lg hover:bg-coffee-700 transition-all"
              >
                Save Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
