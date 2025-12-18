import React from "react";
import { Layout, Menu, Button, Space } from "antd";
import {
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Scissors } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Header } = Layout;

export default function NavigationBar() {
  const { currentUser, bookings, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userBookings =
    bookings?.filter((b) => b.user === currentUser?.id) || [];

  const latestBooking =
    userBookings.length > 0 ? userBookings[userBookings.length - 1] : null;

  const showBookAppointment =
    !latestBooking || latestBooking.status === "cancelled";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 🎯 Menu items (role-aware)
  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
      onClick: () => navigate("/"),
    },
    {
      key: "/products",
      icon: <ShoppingOutlined />,
      label: "Products",
      onClick: () => navigate("/products"),
    },
  ];

  if (currentUser && showBookAppointment) {
    menuItems.push({
      key: "/booking",
      icon: <CalendarOutlined />,
      label: "Book Appointment",
      onClick: () => navigate("/booking"),
    });
  }

  if (currentUser) {
    menuItems.push({
      key: currentUser.role === "admin" ? "/admin" : "/dashboard",
      icon: <UserOutlined />,
      label: currentUser.role === "admin" ? "Admin Panel" : "My Account",
      onClick: () =>
        navigate(currentUser.role === "admin" ? "/admin" : "/dashboard"),
    });
  }

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        padding: 10,
        paddingInline: 25,
        background: "#001529",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {/* Brand */}
      <div
        style={{
          color: "#ffffff",
          fontSize: 18,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          marginRight: 32,
          whiteSpace: "nowrap",
          letterSpacing: "0.4px",
        }}
      >
        <Scissors size={26} style={{ marginRight: 8 }} />
        Polo Fashions
      </div>

      {/* Menu */}
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{
          flex: 1,
          background: "transparent",
          color: "#ffffff",
        }}
        theme="dark"
      />

      {/* Auth Buttons */}
      {!currentUser ? (
        <Space>
          <Button
            icon={<LoginOutlined />}
            style={{
              color: "#E5E7EB",
              borderColor: "#E5E7EB",
              background: "transparent",
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>

          <Button
            style={{
              background: "linear-gradient(135deg, #facc15, #eab308)",
              border: "none",
              color: "#1f2937",
              fontWeight: 600,
            }}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Space>
      ) : (
        <Button icon={<LogoutOutlined />} onClick={handleLogout} danger>
          Logout
        </Button>
      )}
    </Header>
  );
}
