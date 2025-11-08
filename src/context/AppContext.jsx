import React, { useState, useContext, createContext, useMemo, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importamos jwt-decode
import Notification from '../components/ui/Notification';
import * as api from '../lib/api'; // Importamos nuestro servicio de API

// --- Contexto de la Aplicación (Gestión de Estado Global) ---

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};

/**
 * Decodifica un JWT y extrae la información del usuario.
 * TU JWT UTIL DEBE INCLUIR ESTOS CAMPOS EN EL TOKEN.
 * @param {string} token El JWT.
 * @returns {object} { id, name, email, photoUrl, role }
 */
const decodeUserDataFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    // Asumimos que tu JWT contiene estos campos.
    // Ajusta 'sub', 'userId', etc., según cómo tu JwtUtil construya el token.
    return {
      id: decoded.userId || decoded.sub, // 'sub' es estándar para el email, 'userId' es mejor
      name: decoded.name,
      email: decoded.email,
      photoUrl: decoded.photoUrl || 'https://placehold.co/100x100/888888/FFFFFF?text=User', // Fallback
      role: decoded.role,
      token: token,
    };
  } catch (error) {
    console.error("Error decodificando el token:", error);
    return null;
  }
};


export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]); // Ya no usamos INITIAL_USERS
  const [products, setProducts] = useState([]); // Ya no usamos INITIAL_PRODUCTS
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState('home');
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

  // Efecto para cargar productos al inicio
  useEffect(() => {
    fetchProducts();
  }, []);

  // Efecto para comprobar si hay un token en localStorage al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const userData = decodeUserDataFromToken(token);
        if (userData) {
          setCurrentUser(userData);
          fetchOrderHistory(userData.id); // Cargar historial si estamos logueados
        }
      } catch (e) {
        console.error("Token inválido o expirado", e);
        localStorage.removeItem('authToken');
      }
    }
  }, []);
  
  // Efecto para cargar historial de compras cuando el usuario cambia
   useEffect(() => {
    if (currentUser) {
      fetchOrderHistory(currentUser.id);
    } else {
      setPurchaseHistory([]); // Limpiar historial si no hay usuario
    }
  }, [currentUser]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // --- Lógica de Autenticación (Conectada a API) ---
  const login = async (email, password) => {
    try {
      // AuthController devuelve { token, role }
      const { token } = await api.apiLogin(email, password);
      
      localStorage.setItem('authToken', token);
      const userData = decodeUserDataFromToken(token);
      
      if (!userData.role) {
         // Si el token no tiene rol (ej. error de decodificación), usamos el de la respuesta
         userData.role = role;
      }
      
      setCurrentUser(userData);

      // Tu backend ya valida si está aprobado, si llega aquí está aprobado.
      setPage('home');
      showNotification(`Bienvenido, ${userData.name || userData.email}!`);
      return true;
      
    } catch (error) {
      // El backend devuelve el mensaje de error (ej: "Usuario pendiente de aprobación")
      showNotification(error.message || 'Correo o contraseña incorrectos.', 'error');
      return false;
    }
  };

  const register = async (name, email, password, photoFile) => {
    try {
      const formData = new FormData();
      // 1. Añadimos el DTO de usuario como un JSON string (como pide @RequestPart)
      const userDTO = { name, email, password };
      formData.append('user', new Blob([JSON.stringify(userDTO)], { type: "application/json" }));

      // 2. Añadimos la foto si existe
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      // 3. Llamamos a la API
      const responseMessage = await api.apiRegister(formData);
      showNotification(responseMessage, 'success');
      setPage('login'); // Llevamos al login
      return true;

    } catch (error) {
      showNotification(error.message || 'Error en el registro.', 'error');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    setPurchaseHistory([]);
    localStorage.removeItem('authToken');
    setPage('home');
    showNotification('Has cerrado sesión.');
  };

  // --- Lógica de Datos (Conectada a API) ---
  const fetchProducts = async () => {
    try {
      const productsData = await api.apiGetProducts();
      // Tu ProductDTO usa 'imageUrl', nuestro frontend usaba 'image'. Mapeamos.
      const mappedProducts = productsData.map(p => ({ ...p, image: p.imageUrl, comments: [] }));
      setProducts(mappedProducts);
    } catch (error) {
      showNotification('No se pudieron cargar los productos.', 'error');
    }
  };
  
  const fetchOrderHistory = async (userId) => {
    try {
      const orders = await api.apiGetUserOrders(userId);
      // Mapeamos OrderDTO a lo que el frontend espera
      const mappedHistory = orders.map(order => ({
        id: order.id,
        date: order.date,
        items: order.items.map(item => ({ 
            id: item.productId, // Asumimos que podemos usar productId como id
            name: products.find(p => p.id === item.productId)?.name || 'Producto', // Intentamos encontrar el nombre
            quantity: item.quantity 
        })),
        total: order.total,
        discount: 0, // El DTO no tiene 'discount'. Asumimos 0.
        finalTotal: order.total // El DTO no tiene 'finalTotal'. Usamos 'total'.
      }));
      setPurchaseHistory(mappedHistory);
    } catch (error) {
      showNotification('No se pudo cargar el historial de compras.', 'error');
    }
  };
  
  // --- Lógica del Carrito (Sigue siendo local) ---
  const addToCart = (productId) => {
    if (!currentUser) {
      showNotification('Debes iniciar sesión para comprar.', 'warn');
      setPage('login');
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
    const newQuantity = Math.max(1, quantity);
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  }, [cart]);

  // --- Lógica de Pago (Conectada a API) ---
  const placeOrder = async (paymentInfo, couponApplied) => {
    try {
      // 1. Mapear el carrito al OrderItemDTO
      const itemsDTO = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      // 2. Crear el OrderDTO
      const orderDTO = {
        userId: currentUser.id,
        items: itemsDTO,
        total: parseFloat(cartTotal), // El backend recalculará esto, pero lo enviamos
        cardNumber: paymentInfo.cardNumber,
        expiry: paymentInfo.expiry,
        cvv: paymentInfo.cvv
      };
      
      const couponCode = (couponApplied && isNewUser) ? 'NUEVO10' : null;

      // 3. Llamar a la API
      await api.apiCreateOrder(orderDTO, couponCode);

      setCart([]);
      setPage('profile');
      showNotification('¡Pedido realizado con éxito!', 'success');
      fetchOrderHistory(currentUser.id); // Actualizar historial
      
    } catch (error) {
      showNotification(error.message || 'Error al procesar el pedido.', 'error');
    }
  };

  // --- Lógica de Producto (Conectada a API) ---
  const addProductComment = async (productId, text) => {
    if (!currentUser) {
      showNotification('Debes iniciar sesión para comentar.', 'warn');
      return;
    }
    
    try {
      const commentData = {
        text: text,
        userId: currentUser.id,
        productId: productId
      };
      
      const newComment = await api.apiAddComment(productId, commentData);
      
      // Actualizamos el estado local de los comentarios (si los guardáramos)
      // Por ahora, solo notificamos
      showNotification('Comentario añadido.', 'success');
      // Opcional: Volver a cargar comentarios para este producto
      
    } catch (error) {
      showNotification('Error al añadir comentario.', 'error');
    }
  };

  // --- Lógica de Administrador (Conectada a API) ---
  const approveUser = async (userId) => {
    try {
      await api.apiApproveUser(userId);
      showNotification('Usuario aprobado.', 'success');
      // Recargar la lista de usuarios pendientes
      // (Asumimos que AdminPage recarga los datos cuando vuelve a la vista)
      // O podemos actualizar el estado 'users' aquí
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      
    } catch (error) {
      showNotification('Error al aprobar usuario.', 'error');
    }
  };

  const createProduct = async (productData, imageFile) => {
    try {
        const formData = new FormData();
        // 1. ProductDTO como JSON string
        const productDTO = {
            name: productData.name,
            description: productData.description,
            price: parseFloat(productData.price)
        };
        formData.append('dto', new Blob([JSON.stringify(productDTO)], { type: "application/json" }));

        // 2. Imagen (opcional)
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        // 3. Llamar a la API
        const newProduct = await api.apiCreateProduct(formData);
        
        // 4. Actualizar estado local de productos
        setProducts(prevProducts => [{ ...newProduct, image: newProduct.imageUrl, comments: [] }, ...prevProducts]);
        
        showNotification('Producto creado con éxito.', 'success');
        return true; // Para cerrar el modal

    } catch (error) {
        showNotification(error.message || 'Error al crear producto.', 'error');
        return false;
    }
  };

  const value = {
    users, // Usado por AdminPage (para mostrar pendientes)
    setUsers, // Para AdminPage
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
    createProduct,
    // Funciones de carga para que las páginas las usen
    fetchOrderHistory,
    fetchProducts,
    showNotification
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