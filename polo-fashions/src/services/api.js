import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/accounts/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('currentUser');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/accounts/login/', { username: email.split('@')[0], password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/accounts/register/', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/accounts/users/me/');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/accounts/users/');
    return response.data;
  },
  
  updateMeasurement: async (userId, formData) => {
    const response = await api.patch(
      `/accounts/users/${userId}/update_measurement/`,
      formData
    );
    return response.data;
  },
};

// ------------------- RENTALS -------------------
export const rentalsAPI = {
  getAll: () => api.get("/rentals/").then(r => r.data),
};

// ------------------- ACCESSORIES -------------------
export const accessoriesAPI = {
  getAll: () => api.get("/accessories/").then(r => r.data),
};

// ------------------- INNERWEAR -------------------
export const innerwearAPI = {
  getAll: () => api.get("/innerwear/").then(r => r.data),
};

// Products APIs
export const productsAPI = {
  getAll: async () => {
    const response = await api.get('/products/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },
};

// Fabrics APIs
export const fabricsAPI = {
  getAll: async () => {
    const response = await api.get('/fabrics/');
    return response.data;
  },
};

// Bookings APIs
export const bookingsAPI = {
  getAll: async () => {
    const response = await api.get('/bookings/');
    return response.data;
  },

  create: async (bookingData) => {
    const payload = {
      phone: bookingData.phone,
      date: bookingData.date,
      time: bookingData.time,
    };
    const response = await api.post('/bookings/', payload);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(
      `/bookings/${id}/`,
      { status }
    );
    return response.data;
  },
};

// ================= ORDERS API (COMPREHENSIVE FIX) =================
export const ordersAPI = {
  getAll: async () => {
    const response = await api.get('/orders/');
    return response.data;
  },
    // ✅ ADD THIS METHOD
  getById: async (id) => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },
  
  
  create: async (orderData) => {
    // ✅ BASE PAYLOAD (always required)
    const payload = {
      quantity: orderData.quantity || 1,
      total_price: orderData.totalPrice,
    };

    console.log('📦 Creating order with data:', orderData);

    // ================= ORDER TYPE DETECTION =================

    // ✅ TYPE 1: FABRIC ORDERS (from Fabrics tab)
    if (orderData.fabricId) {
      payload.fabric = orderData.fabricId;
      
      if (orderData.meters) {
        payload.meters = Number(orderData.meters);
        payload.fabric_price_per_meter = Number(orderData.fabricPricePerMeter);
      }

      // With stitching
      if (orderData.stitchType) {
        payload.stitch_type = orderData.stitchType;
        payload.stitching_charge = Number(orderData.stitchingCharge);
      }

      console.log('🧵 Fabric order payload:', payload);
    }
    
    // ✅ TYPE 2: RENTAL ORDERS
    else if (orderData.rentalItemId) {
      payload.rental_item = orderData.rentalItemId;
      payload.rental_days = Number(orderData.rentalDays) || 0;
      payload.rental_deposit = Number(orderData.rentalDeposit) || 0;
      payload.rental_price_per_day = Number(orderData.rentalPricePerDay) || 0;

      if (orderData.size) {
        payload.size = orderData.size;
      }

      console.log('🎩 Rental order payload:', payload);
    }
    
    // ✅ TYPE 3: ACCESSORY ORDERS
    else if (orderData.accessoryId) {
      payload.accessory = orderData.accessoryId;
      
      if (orderData.size) {
        payload.size = orderData.size;
      }

      console.log('👔 Accessory order payload:', payload);
    }
    
    // ✅ TYPE 4: INNERWEAR ORDERS
    else if (orderData.innerwearId) {
      payload.innerwear = orderData.innerwearId;
      
      if (orderData.size) {
        payload.size = orderData.size;
      }

      console.log('👕 Innerwear order payload:', payload);
    }
    
    // ✅ TYPE 5: PRODUCT ORDERS (Ready-made, Traditional, Custom products)
    else if (orderData.productId) {
      payload.product = orderData.productId;

      // ✅ Ready-made / Traditional orders
      if (orderData.orderType === "readymade" || orderData.orderType === "traditional") {
        if (orderData.size) {
          payload.size = orderData.size;
        }
        
        // Traditional with stitching
        if (orderData.stitchType) {
          payload.stitch_type = orderData.stitchType;
          payload.stitching_charge = Number(orderData.stitchingCharge);
        }
      }

      // ✅ Custom products (with fabric)
      if (orderData.fabricPricePerMeter) {
        payload.fabric_price_per_meter = Number(orderData.fabricPricePerMeter);
      }

      if (orderData.meters) {
        payload.meters = Number(orderData.meters);
      }

      // Stitching for custom products
      if (orderData.stitchType && !payload.stitch_type) {
        payload.stitch_type = orderData.stitchType;
        payload.stitching_charge = Number(orderData.stitchingCharge);
      }

      console.log('📦 Product order payload:', payload);
    }

    // ✅ ERROR: No valid order type detected
    else {
      console.error('❌ Invalid order data - no product ID found:', orderData);
      throw new Error('Invalid order data: No product identifier provided');
    }

    // ✅ SEND REQUEST
    try {
      console.log('🚀 Sending order payload:', payload);
      const response = await api.post('/orders/', payload);
      console.log('✅ Order created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Order creation failed:', error.response?.data || error);
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(
      `/orders/${id}/update-status/`,
      { status }
    );
    return response.data;
  },
};

export default api;