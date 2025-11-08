// --- src/lib/api.js ---
// Este archivo centraliza todas las llamadas a la API de Spring Boot.

const BASE_URL = '/api'; // Usamos /api para que el proxy de Vite lo redirija

/**
 * Obtiene el token JWT del localStorage.
 * @returns {string|null} El token.
 */
const getToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Función de 'fetch' personalizada.
 * @param {string} endpoint El endpoint de la API (ej: '/products').
 * @param {object} options Opciones de fetch (method, body, headers, etc.).
 * @param {boolean} isFormData Si el body es FormData (para subida de archivos).
 * @returns {Promise<any>} Los datos JSON de la respuesta.
 */
const request = async (endpoint, options = {}, isFormData = false) => {
  const token = getToken();
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // No establecer Content-Type si es FormData, el navegador lo hace.
  if (!isFormData && options.body) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error en la petición API:', errorBody);
    throw new Error(errorBody || 'Error en la petición a la API');
  }

  // Si la respuesta no tiene contenido (ej: 204 No Content o approveUser)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null; // O un objeto de éxito
  }
  
  // El login devuelve texto (token), no JSON
  if (endpoint === '/auth/login' && response.headers.get('content-type')?.includes('application/json')) {
     return response.json(); // Asumimos que AuthResponse { token, role } es JSON
  }

  return response.json();
};

// --- SERVICIOS DE API ---

// =======================
// Auth Service
// =======================
export const apiLogin = (email, password) => {
  return request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
};

export const apiRegister = (formData) => {
  // formData debe ser un objeto FormData
  return request('/auth/register', {
    method: 'POST',
    body: formData,
  }, true); // true indica que es FormData
};

// =======================
// Product Service
// =======================
export const apiGetProducts = () => {
  return request('/products');
};

export const apiGetProductById = (id) => {
  return request(`/products/${id}`);
};

export const apiGetProductComments = (id) => {
  return request(`/products/${id}/comments`);
};

export const apiAddComment = (productId, commentData) => {
  // commentData = { text, userId, productId }
  return request(`/products/${productId}/comments`, {
    method: 'POST',
    body: commentData,
  });
};

// =======================
// Order Service
// =======================
export const apiCreateOrder = (orderData, couponCode) => {
  const endpoint = couponCode ? `/orders?coupon=${couponCode}` : '/orders';
  return request(endpoint, {
    method: 'POST',
    body: orderData, // orderData debe ser OrderDTO
  });
};

export const apiGetUserOrders = (userId) => {
  return request(`/orders/user/${userId}`);
};

// =======================
// Admin Service
// =======================
export const apiGetPendingUsers = () => {
  return request('/admin/pending-users');
};

export const apiApproveUser = (userId) => {
  return request(`/admin/approve-user/${userId}`, {
    method: 'POST',
  });
};

export const apiCreateProduct = (formData) => {
  // formData debe ser un objeto FormData
  return request('/admin/products', {
    method: 'POST',
    body: formData,
  }, true); // true indica que es FormData
};