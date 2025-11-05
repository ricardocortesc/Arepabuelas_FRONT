import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { 
  Home, 
  ShoppingCart, 
  User, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  X, 
  Menu
} from 'lucide-react';

const Header = () => {
  const { currentUser, cart, setPage, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const NavLink = ({ page, children, icon }) => (
    <button
      onClick={() => { setPage(page); setIsMenuOpen(false); }}
      className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
    >
      {icon}
      <span>{children}</span>
    </button>
  );

  const navLinks = (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
      <NavLink page="home" icon={<Home className="h-4 w-4" />}>Inicio</NavLink>
      {currentUser?.role === 'admin' && (
        <NavLink page="admin" icon={<ShieldCheck className="h-4 w-4" />}>Admin</NavLink>
      )}
      {currentUser && (
        <NavLink page="profile" icon={<User className="h-4 w-4" />}>Perfil</NavLink>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <button onClick={() => setPage('home')} className="text-2xl font-bold text-red-600">
            Arepa<span className="text-gray-800">buelas</span>
          </button>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setPage('cart')} className="relative"> {/* 1. Añadimos 'relative' al botón */}
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                // 2. Ajustamos la posición y el tamaño para que sea relativo al botón
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {currentUser ? (
              <div className="hidden md:flex items-center space-x-2">
                <img src={currentUser.photo} alt={currentUser.name} className="h-8 w-8 rounded-full" />
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setPage('login')}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
                <Button size="sm" onClick={() => setPage('register')}>
                  Registrarse
                </Button>
              </div>
            )}
            
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menú Móvil */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg p-4 z-50">
          {navLinks}
          <div className="border-t my-4"></div>
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <img src={currentUser.photo} alt={currentUser.name} className="h-8 w-8 rounded-full" />
              <Button variant="outline" className="w-full" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Button variant="outline" className="w-full" onClick={() => { setPage('login'); setIsMenuOpen(false); }}>
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </Button>
              <Button className="w-full" onClick={() => { setPage('register'); setIsMenuOpen(false); }}>
                Registrarse
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;