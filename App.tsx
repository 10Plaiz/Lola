import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import MenuPage from './pages/MenuPage';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import VisitUs from './components/VisitUs';
import { AuthProvider, useAuth } from './context/AuthContext';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="pt-32 text-center">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      <Menu />
      <Testimonials />
    </>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    console.log('[App] === Lola App Startup Diagnostics ===' );
    console.log('[App] Timestamp:', new Date().toISOString());
    console.log('[App] Location:', window.location.href);
    console.log('[App] VITE_SUPABASE_URL configured:', !!import.meta.env.VITE_SUPABASE_URL);
    console.log('[App] VITE_SUPABASE_ANON_KEY configured:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

    // Test /api/health to verify backend + Supabase connectivity
    fetch('/api/health')
      .then(r => {
        console.log('[App] /api/health status:', r.status);
        return r.json();
      })
      .then(data => console.log('[App] /api/health response:', JSON.stringify(data)))
      .catch(err => console.error('[App] /api/health FAILED:', err.message));

    // Test /api/menu
    fetch('/api/menu')
      .then(r => {
        console.log('[App] /api/menu status:', r.status);
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          console.log('[App] /api/menu returned', data.length, 'items');
        } else {
          console.log('[App] /api/menu response (not array):', JSON.stringify(data));
        }
      })
      .catch(err => console.error('[App] /api/menu FAILED:', err.message));
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-cream font-sans text-coffee-900 selection:bg-coffee-200 selection:text-coffee-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/visit-us" element={<VisitUs />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;