import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Booking from './pages/Booking';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const { currentUser } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'login':
        return <Login setCurrentPage={setCurrentPage} />;
      case 'register':
        return <Register setCurrentPage={setCurrentPage} />;
      case 'products':
        return <Products setCurrentPage={setCurrentPage} />;
      case 'booking':
        return <Booking setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return <UserDashboard setCurrentPage={setCurrentPage} />;
      case 'admin':
        // Protect admin route - only admins can access
        return currentUser?.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <Home setCurrentPage={setCurrentPage} />
        );
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;