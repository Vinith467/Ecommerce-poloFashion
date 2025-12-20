import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Home from "../pages/Home";
import Products from "../pages/Products";
import Booking from "../pages/Booking";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import OrderTracking from "../pages/OrderTracking";

function PrivateRoute({ children, adminOnly = false }) {
  const { currentUser, authLoading } = useAuth();

  if (authLoading) return null; // or spinner

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />

        <Route
          path="/booking"
          element={
            <PrivateRoute>
              <Booking />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />

        {/* ✅ CUSTOMER ORDER TRACKING */}
        <Route
          path="/orders/:id"
          element={
            <PrivateRoute>
              <OrderTracking />
            </PrivateRoute>
          }
        />

        {/* ✅ ADMIN */}
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
