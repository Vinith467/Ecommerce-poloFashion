import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
// RAI apis
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
    // Only send what we have - Django will fill the rest from request.user
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
// Orders APIs
export const ordersAPI = {
  getAll: async () => {
    const response = await api.get('/orders/');
    return response.data;
  },
  create: async (orderData) => {
    const payload = {
      quantity: orderData.quantity,
      total_price: orderData.totalPrice,
    };

    // ✅ RENTAL ORDERS
    if (orderData.rentalItemId) {
      payload.rental_item = orderData.rentalItemId;  // ✅ Use rental_item field
      payload.rental_days = orderData.rentalDays;
      payload.rental_deposit = orderData.rentalDeposit;
      payload.rental_price_per_day = orderData.rentalPricePerDay;

      if (orderData.size) {
        payload.size = orderData.size;
      }
    }
    // ✅ REGULAR PRODUCT ORDERS
    else if (orderData.productId) {
      payload.product = orderData.productId;

      // Fabric price
      if (orderData.fabricPricePerMeter) {
        payload.fabric_price_per_meter = orderData.fabricPricePerMeter;
      }

      // Meters
      if (orderData.meters) {
        payload.meters = orderData.meters;
      }

      // Stitching
      if (orderData.stitchType) {
        payload.stitch_type = orderData.stitchType;
        payload.stitching_charge = orderData.stitchingCharge;
      }

      // Size
      if (orderData.size) {
        payload.size = orderData.size;
      }
    }

    const response = await api.post('/orders/', payload);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/update-status/`,
      { status }  // Backend expects { status: "new_status" }
    );
    return response.data;
  },
};

export default api;