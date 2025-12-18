import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI, bookingsAPI, ordersAPI } from "../services/api";

/* eslint-disable react-refresh/only-export-components */
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const refreshOrders = async () => {
    try {
      const ordersData = await ordersAPI.getAll();
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to refresh orders:", error);
    }
  };

  // ========================================
  // Initialize user from token on refresh
  // ========================================
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();

          // ✅ ADD ADMIN FLAG
          setCurrentUser({
            ...userData,
            isAdmin: userData.is_staff || userData.is_superuser,
          });
        } catch (error) {
          console.error("Failed to get current user:", error);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
      setAuthLoading(false);
    };

    initializeAuth();
  }, []);

  // ========================================
  // Fetch bookings + orders
  // ========================================
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      // ===============================
      // ADMIN — Fetch Everything
      // ===============================
      if (currentUser.isAdmin) {
        try {
          const usersData = await authAPI.getAllUsers();
          setUsers(usersData);
        } catch (error) {
          console.error("Failed to load users:", error);
        }

        try {
          const bookingsData = await bookingsAPI.getAll();
          setBookings(bookingsData);
        } catch (error) {
          console.error("Failed to load bookings:", error);
        }

        try {
          const ordersData = await ordersAPI.getAll();
          setOrders(ordersData);
        } catch (error) {
          console.error("Failed to load orders:", error);
        }

        return;
      }

      // ===============================
      // CUSTOMER — Only load personal bookings + orders
      // ===============================
      try {
        const bookingsData = await bookingsAPI.getAll();
        setBookings(bookingsData);
      } catch (error) {
        console.error("Failed to load bookings:", error);
      }

      try {
        const ordersData = await ordersAPI.getAll();
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to load orders:", error);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [currentUser, authLoading]);

  // ========================================
  // LOGIN
  // ========================================
  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);

      // Store tokens in localStorage
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // Fetch user details
      const userData = await authAPI.getCurrentUser();

      const updatedUser = {
        ...userData,
        isAdmin: userData.is_staff || userData.is_superuser,
      };

      setCurrentUser(updatedUser);

      // ========================================
      // ADMIN REDIRECT
      // ========================================

      if (updatedUser.isAdmin) {
        return { success: true, user: updatedUser, redirectTo: "admin" };
      }

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message: error.response?.data?.detail || "Invalid email or password",
      };
    }
  };

  // ========================================
  // REGISTER
  // ========================================
  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      return {
        success: true,
        message: "Registration successful! Please login.",
      };
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage =
        error.response?.data?.email?.[0] ||
        error.response?.data?.username?.[0] ||
        "Registration failed. Please try again.";
      return { success: false, message: errorMessage };
    }
  };

  // ========================================
  // LOGOUT
  // ========================================
  const logout = () => {
    setCurrentUser(null);
    setUsers([]);
    setBookings([]);
    setOrders([]);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  // ========================================
  // BOOKINGS
  // ========================================
  const addBooking = async (bookingData) => {
    try {
      const newBooking = await bookingsAPI.create(bookingData);
      setBookings([...bookings, newBooking]);
      return { success: true, message: "Booking created successfully!" };
    } catch (error) {
      console.error("Failed to create booking:", error);
      return {
        success: false,
        message: error.response?.data?.detail || "Failed to create booking",
      };
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const updatedBooking = await bookingsAPI.updateStatus(bookingId, status);
      setBookings(
        bookings.map((b) => (b.id === bookingId ? updatedBooking : b))
      );
      return { success: true };
    } catch (error) {
      console.error("Failed to update booking:", error);
      return { success: false };
    }
  };

  // ========================================
  // MEASUREMENT UPDATE
  // ========================================
  const updateUserMeasurement = async (userId, formData) => {
    try {
      // 1. Update measurement on backend
      await authAPI.updateMeasurement(userId, formData);

      // 2. Fetch updated users list
      const refreshedUsers = await authAPI.getAllUsers();
      setUsers(refreshedUsers);

      // 3. If the logged-in user was updated, refresh their data too
      if (currentUser && currentUser.id === userId) {
        const updatedUser = refreshedUsers.find((u) => u.id === userId);
        setCurrentUser(updatedUser);
      }

      return { success: true };
    } catch (err) {
      console.log("Error updating measurement:", err);
      return { success: false };
    }
  };

  // ========================================
  // ORDERS
  // ========================================
  const addOrder = async (orderData) => {
    try {
      await ordersAPI.create(orderData);
      await refreshOrders(); // ✅ SINGLE SOURCE OF TRUTH
      return { success: true, message: "Order placed successfully!" };
    } catch (error) {
      console.error("Failed to create order:", error);
      return {
        success: false,
        message: error.response?.data?.detail || "Failed to place order",
      };
    }
  };

  // ========================================
  // CONTEXT VALUE
  // ========================================
  const value = {
    currentUser,
    users,
    bookings,
    orders,
    authLoading,
    login,
    register,
    logout,
    addBooking,
    updateBookingStatus,
    updateUserMeasurement,
    addOrder,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
