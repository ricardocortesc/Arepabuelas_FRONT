import React, { useState, useContext, createContext, useMemo, useEffect } from 'react';
import { INITIAL_USERS, INITIAL_PRODUCTS } from '../data/mockData';
import Notification from '../components/ui/Notification';

// --- Contexto de la Aplicación (Gestión de Estado Global) ---

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState('home'); // Simula el enrutamiento
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [notification, setNotification] = useState(null);

  // Efecto para mostrar notificaciones temporalmente
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // --- Lógica de Autenticación ---
  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      if (!user.approved) {
        showNotification('Tu cuenta está pendiente de aprobación por un administrador.', 'warn');
        return false;
      }
      setCurrentUser(user);
      setPage('home');
      showNotification(`Bienvenido, ${user.name}!`);
      return true;
    }
    showNotification('Correo o contraseña incorrectos.', 'error');
    return false;
  };

  const register = (name, email, password, photo) => {
    // Simulación: Comprobar si el email ya existe
    if (users.find(u => u.email === email)) {
      showNotification('Este correo electrónico ya está registrado.', 'error');
      return false;
    }
    const newUser = {
      id: `u${users.length + 1}`,
      name,
      email,
      password,
      photo: photo || 'https://placehold.co/100x100/888888/FFFFFF?text=User',
      role: 'user',
      approved: false // REQUISITO: El admin debe aprobar
    };
    setUsers([...users, newUser]);
    showNotification('Registro exitoso. Tu cuenta será activada por un administrador.', 'success');
    setPage('login'); // Llevamos al login
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    setPage('home');
    showNotification('Has cerrado sesión.');
  };

  // --- Lógica del Carrito ---
  const addToCart = (productId) => {
    if (!currentUser) {
      showNotification('Debes iniciar sesión para comprar.', 'warn');
      setPage('login');
      return;
    }
    if (!currentUser.approved) {
      showNotification('Tu cuenta aún no está aprobada para comprar.', 'warn');
      return;
    }
    
    const product = products.find(p => p.id === productId);
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    showNotification(`${product.name} añadido al carrito!`);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    const newQuantity = Math.max(1, quantity); // Mínimo 1
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  }, [cart]);

  // --- Lógica de Pago ---
  const placeOrder = (paymentInfo, couponApplied) => {
    // Simulación de pago
    console.log("Simulando pago con:", paymentInfo);
    
    // REQUISITO: Almacenar historial de compras
    const order = {
      id: `o${purchaseHistory.length + 1}`,
      date: new Date().toISOString(),
      items: [...cart],
      total: cartTotal,
      discount: couponApplied ? (cartTotal * 0.1).toFixed(2) : 0, // Cupón simulado del 10%
      finalTotal: couponApplied ? (cartTotal * 0.9).toFixed(2) : cartTotal
    };
    
    setPurchaseHistory(prevHistory => [order, ...prevHistory]);
    setCart([]);
    setPage('profile');
    showNotification('¡Pedido realizado con éxito!', 'success');
  };

  // --- Lógica de Producto ---
  const addProductComment = (productId, text) => {
    if (!currentUser) {
      showNotification('Debes iniciar sesión para comentar.', 'warn');
      return;
    }
    const newComment = {
      id: `c${Math.random()}`,
      user: currentUser.name,
      text: text
    };
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId
          ? { ...p, comments: [...p.comments, newComment] }
          : p
      )
    );
  };

  // --- Lógica de Administrador ---
  const approveUser = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === userId ? { ...u, approved: true } : u
      )
    );
    showNotification('Usuario aprobado.', 'success');
  };

  const createProduct = (productData) => {
    const newProduct = {
      id: `p${products.length + 1}`,
      ...productData,
      image: productData.image || 'https://placehold.co/600x400/888888/FFFFFF?text=Nuevo+Producto',
      comments: []
    };
    setProducts(prevProducts => [newProduct, ...prevProducts]);
    showNotification('Producto creado con éxito.', 'success');
    return true; // Para cerrar el modal
  };

  const value = {
    users,
    products,
    currentUser,
    cart,
    page,
    purchaseHistory,
    cartTotal,
    login,
    register,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    setPage,
    placeOrder,
    addProductComment,
    approveUser,
    createProduct
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </AppContext.Provider>
  );
};