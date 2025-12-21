import React from "react";
import { Row, Col, Card, Button, Typography, Space } from "antd";
import {
  ScissorOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  ColumnWidthOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, bookings = [] } = useAuth();

  const userBookings =
    currentUser?.role === "customer"
      ? bookings.filter((b) => b.user === currentUser.id)
      : [];

  const latestBooking =
    userBookings.length > 0
      ? userBookings[userBookings.length - 1]
      : null;

  const showBookAppointment =
    currentUser &&
    currentUser.role === "customer" &&
    (!latestBooking || latestBooking.status === "cancelled");

  return (
    <div>
      {/* HERO SECTION */}
      <div className="hero-section"
      style={{
          background: "linear-gradient(135deg, #001529, #4096ff)",
          padding: "100px 20px",
          color: "#fff",
          textAlign: "center",
        }}>
        <Title style={{ color: "#fff" }}>
          Welcome to Polo Fashions
        </Title>

        <Paragraph style={{ color: "#e6f4ff", fontSize: 18 }}>
          Where Traditional Craftsmanship Meets Modern Convenience
        </Paragraph>

        {/* AUTH-AWARE CTA */}
        {!currentUser && (
          <Space size="middle" wrap style={{ justifyContent: "center" }}>
            <Button size="large" onClick={() => navigate("/products")}>
              Explore Collection
            </Button>
            <Button
             style={{
              background: "linear-gradient(135deg, #facc15, #eab308)",
              border: "none",
              color: "#1f2937",
              fontWeight: 600,
            }}
              type="primary"
              size="large"
              onClick={() => navigate("/register")}
            >
              Register Now
            </Button>
          </Space>
        )}

        {currentUser?.role === "customer" && (
          <Space size="middle" wrap style={{ justifyContent: "center" }}>
            <Button
              size="large"
              icon={<UserOutlined />}
              onClick={() => navigate("/dashboard")}
            >
              My Dashboard
            </Button>

            <Button
              type="primary"
              size="large"
              icon={<ShoppingOutlined />}
              onClick={() => navigate("/products")}
            >
              Browse Products
            </Button>

            {showBookAppointment && (
              <Button
                size="large"
                icon={<CalendarOutlined />}
                onClick={() => navigate("/booking")}
              >
                Book Appointment
              </Button>
            )}
          </Space>
        )}

        {currentUser?.role === "admin" && (
          <Space size="large">
            <Button
              type="primary"
              size="large"
              icon={<SettingOutlined />}
              onClick={() => navigate("/admin")}
            >
              Go to Admin Dashboard
            </Button>
          </Space>
        )}
      </div>

      {/* FEATURES SECTION */}
      <div style={{ padding: "60px 20px" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 48 }}>
          Why Choose Polo Fashions?
        </Title>

        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={12} lg={6}>
            <Card hoverable style={{ textAlign: "center", height: "100%" }}>
              <ScissorOutlined style={{ fontSize: 32, color: "#1677ff" }} />
              <Title level={4}>Custom Tailoring</Title>
              <Text>Perfectly tailored clothes made to your measurements</Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6}>
            <Card hoverable style={{ textAlign: "center", height: "100%" }}>
              <ColumnWidthOutlined style={{ fontSize: 32, color: "#1677ff" }} />
              <Title level={4}>One-Time Measurement</Title>
              <Text>Visit once, shop online anytime</Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6}>
            <Card hoverable style={{ textAlign: "center", height: "100%" }}>
              <ShoppingOutlined style={{ fontSize: 32, color: "#1677ff" }} />
              <Title level={4}>Premium Brands</Title>
              <Text>Ramraj, DSP, and more</Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6}>
            <Card hoverable style={{ textAlign: "center", height: "100%" }}>
              <CalendarOutlined style={{ fontSize: 32, color: "#1677ff" }} />
              <Title level={4}>Easy Booking</Title>
              <Text>Book measurement online in seconds</Text>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}