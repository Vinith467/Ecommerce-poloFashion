import React, { useState } from "react";
import { Layout, Menu, Button, Space, Drawer } from "antd";
import {
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  CalendarOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Scissors } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../products/ProductModals.css"; 

const { Header } = Layout;

export default function NavigationBar() {
  const { currentUser, bookings, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userBookings =
    bookings?.filter((b) => b.user === currentUser?.id) || [];

  const latestBooking =
    userBookings.length > 0 ? userBookings[userBookings.length - 1] : null;

  const showBookAppointment =
    !latestBooking || latestBooking.status === "cancelled";

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  // Menu items
  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
      onClick: () => {
        navigate("/");
        setMobileMenuOpen(false);
      },
    },
    {
      key: "/products",
      icon: <ShoppingOutlined />,
      label: "Products",
      onClick: () => {
        navigate("/products");
        setMobileMenuOpen(false);
      },
    },
  ];

  if (currentUser && showBookAppointment) {
    menuItems.push({
      key: "/booking",
      icon: <CalendarOutlined />,
      label: "Book Appointment",
      onClick: () => {
        navigate("/booking");
        setMobileMenuOpen(false);
      },
    });
  }

  if (currentUser) {
    menuItems.push({
      key: currentUser.role === "admin" ? "/admin" : "/dashboard",
      icon: <UserOutlined />,
      label: currentUser.role === "admin" ? "Admin Panel" : "My Account",
      onClick: () => {
        navigate(currentUser.role === "admin" ? "/admin" : "/dashboard");
        setMobileMenuOpen(false);
      },
    });
  }

  return (
    <>
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
            marginRight: 24,
            whiteSpace: "nowrap",
            letterSpacing: "0.4px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <Scissors size={24} style={{ marginRight: 8 }} />
          <span className="brand-text">Polo Fashions</span>
        </div>

        {/* Desktop Menu */}
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            flex: 1,
            background: "transparent",
            color: "#ffffff",
            border: "none",
          }}
          theme="dark"
          className="desktop-menu"
        />

        {/* Desktop Auth Buttons */}
        <div className="desktop-auth">
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
            <Button
              icon={<LogoutOutlined />}
              style={{
                background: "#7c0707ff",
                border: "none",
                color: "white",
                fontWeight: 600,
              }}
              onClick={handleLogout}
              danger
            >
              Logout
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          className="mobile-menu-button"
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuOpen(true)}
          style={{
            color: "#ffffff",
            fontSize: 20,
            display: "none",
          }}
        />
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ border: "none" }}
        />

        <div
          style={{
            padding: "16px 0",
            borderTop: "1px solid #f0f0f0",
            marginTop: 16,
          }}
        >
          {!currentUser ? (
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                icon={<LoginOutlined />}
                block
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
              >
                Login
              </Button>

              <Button
                type="primary"
                block
                onClick={() => {
                  navigate("/register");
                  setMobileMenuOpen(false);
                }}
              >
                Register
              </Button>
            </Space>
          ) : (
            <Button
              danger
              icon={<LogoutOutlined />}
              block
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </Drawer>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }

          .desktop-auth {
            display: none !important;
          }

          .mobile-menu-button {
            display: inline-flex !important;
          }

          .brand-text {
            font-size: 16px;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-button {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
