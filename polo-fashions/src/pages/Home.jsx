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

  // Same booking logic as Navbar (VERY IMPORTANT)
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
      <div
        style={{
          background: "linear-gradient(135deg, #1677ff, #4096ff)",
          padding: "100px 20px",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Title style={{ color: "#fff" }}>
          Welcome to Polo Fashions
        </Title>

        <Paragraph style={{ color: "#e6f4ff", fontSize: 18 }}>
          Where Traditional Craftsmanship Meets Modern Convenience
        </Paragraph>

        {/* 🔑 AUTH-AWARE CTA */}
        {!currentUser && (
          <Space size="large">
            <Button size="large" onClick={() => navigate("/products")}>
              Explore Collection
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/register")}
            >
              Register Now
            </Button>
          </Space>
        )}

        {currentUser?.role === "customer" && (
          <Space size="large">
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

      {/* FEATURES SECTION (UNCHANGED) */}
      <div style={{ padding: "80px 40px" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 48 }}>
          Why Choose Polo Fashions?
        </Title>

        <Row gutter={[24, 24]}>
          <Col span={6}>
            <Card hoverable style={{ textAlign: "center" }}>
              <ScissorOutlined style={{ fontSize: 32, color: "#1677ff" }} />
              <Title level={4}>Custom Tailoring</Title>
              <Text>Perfectly tailored clothes made to your measurements</Text>
            </Card>
          </Col>

          <Col span={6}>
            <Card hoverable style={{ textAlign: "center" }}>
              <ColumnWidthOutlined style={{ fontSize: 32, color: "#1677ff" }} />
              <Title level={4}>One-Time Measurement</Title>
              <Text>Visit once, shop online anytime</Text>
            </Card>
          </Col>

          <Col span={6}>
            <Card hoverable style={{ textAlign: "center" }}>
              <ShoppingOutlined style={{ fontSize: 32, color: "#1677ff" }} />
              <Title level={4}>Premium Brands</Title>
              <Text>Ramraj, DSP, and more</Text>
            </Card>
          </Col>

          <Col span={6}>
            <Card hoverable style={{ textAlign: "center" }}>
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
