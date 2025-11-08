import React from 'react';
import { useApp } from './context/AppContext';
import { User } from 'lucide-react'; // Importamos el icono

// Layout
import Header from './layout/Header';
import Footer from './layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

// Componente para renderizar la página correcta
const RenderPage = () => {
  const { page, currentUser } = useApp();

  // Separar la página y el ID (ej: "product/p1")
  const [mainPage, id] = page.split('/');

  // Protección de rutas
  if ((mainPage === 'profile' || mainPage === 'checkout') && !currentUser) {
    // Si no hay usuario, redirigir al login
    return <LoginPage />;
  }
  
  // CAMBIO: La lógica de 'aprobado' ahora la maneja el backend en el login.
  // Ya no necesitamos esta comprobación aquí.
  
  // Si intenta acceder a admin sin ser admin
  if (mainPage === 'admin' && currentUser?.role !== 'ADMIN') { // Tu backend usa 'admin' o 'ADMIN'? Ajusta si es necesario
    return <HomePage />; // Redirigir al inicio
  }

  switch (mainPage) {
    case 'home':
      return <HomePage />;
    case 'product':
      return <ProductDetailPage id={id} />;
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'cart':
      return <CartPage />;
    case 'checkout':
      return <CheckoutPage />;
    case 'profile':
      return <ProfilePage />;
    case 'admin':
      return <AdminPage />;
    default:
      return <HomePage />;
  }
};

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-grow container mx-auto max-w-7xl px-4 py-8">
        <RenderPage />
      </main>
      <Footer />
    </div>
  );
}